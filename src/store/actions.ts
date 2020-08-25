import { ActionTree } from "vuex";
import Api from "../api";

import { bnToBn } from "@polkadot/util";
import { formatBalance } from "@polkadot/util";
import { EventRecord, ExtrinsicStatus } from "@polkadot/types/interfaces";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

let currentTransactionIndex = 0;

export const actions: ActionTree<State, State> = {
  changeAccount(context, account) {
    context.commit("setAccount", account);
    context.commit("setAssetBalances", []);
  },
  changeSelectedPool(context, poolId) {
    context.dispatch("getSpotPrice");
    context.commit("setSelectedPool", poolId);
  },
  changeTradeAmount(context, tradeAmount) {
    context.commit("setTradeAmount", tradeAmount);
    context.dispatch("getSellPrice");
  },
  changeTradeProperties(context, tradeProperties) {
    context.commit("setTradeProperties", tradeProperties);

    if (
      context.state.tradeProperties.token1 != null &&
      context.state.tradeProperties.token2 != null
    ) {
      context.dispatch("getSellPrice");
      context.dispatch("getSpotPrice");
    }
  },
  mintAsset: async (context, assetId) => {
    const api = Api.getApi();
    const account = context.state.account;
    if (api && account) {
      const signer = await Api.getSinger(account);
      api.tx.faucet
        .mint(assetId, 100000000000000)
        .signAndSend(account, { signer: signer }, (/*{ events, status }*/) => {
          // TODO:STUFF
        });
    }
  },
  getSpotPrice: async context => {
    const api = Api.getApi();
    if (context.state.polling.spot) clearTimeout(context.state.polling.spot);
    if (api) {
      const state = context.state;
      const currentScreen = context.state.currentScreen;

      let token1: number | null = null;
      let token2: number | null = null;

      if (currentScreen === "trade") {
        token1 = state.tradeProperties.token1;
        token2 = state.tradeProperties.token2;
      } else if (currentScreen === "liquidity") {
        token1 = state.liquidityProperties.token1;
        token2 = state.liquidityProperties.token2;
      } else {
        return;
      }

      const timeout = setTimeout(async () => {
        const amountData =
          // @ts-expect-error
          await api.rpc.amm.getSpotPrice(token1, token2, 1000000000000);

        const amount = amountData.amount;
        context.commit("updateSpotPrice", amount);
      }, 200);
      context.commit("setSpotPriceTimer", timeout);
    }
  },
  getSellPrice: async context => {
    const api = Api.getApi();
    if (context.state.polling.real) clearTimeout(context.state.polling.real);
    if (api) {
      const timeout = setTimeout(async () => {
        let amount = bnToBn(0);
        if (context.state.tradeAmount.inputAmount) {
          if (context.state.tradeProperties.actionType === "sell") {
            // @ts-expect-error
            const amountData = await api.rpc.amm.getSellPrice(
              context.state.tradeProperties.token1,
              context.state.tradeProperties.token2,
              context.state.tradeAmount.amount
            );

            amount = amountData.amount;
          } else {
            // @ts-expect-error
            const amountData = await api.rpc.amm.getBuyPrice(
              context.state.tradeProperties.token1,
              context.state.tradeProperties.token2,
              context.state.tradeAmount.amount
            );

            amount = amountData.amount;
          }
        }
        context.commit("updateSellPrice", amount);
      }, 200);
      context.commit("setSellPriceTimer", timeout);
    }
  },
  addLiquidity: async context => {
    const api = Api.getApi();
    const account = context.state.account;
    const amount = context.state.liquidityAmount.amount;
    const token1 = context.state.liquidityProperties.token1;
    const token2 = context.state.liquidityProperties.token2;
    const spotPrice = context.state.spotPrice.inputAmount;
    const maxSellPrice = amount
      .mul(bnToBn(spotPrice * 1.1 * 10 ** 3))
      .div(bnToBn(10 ** 3));

    console.log(maxSellPrice);
    if (api && account) {
      const signer = await Api.getSinger(account);
      api.tx.amm
        .addLiquidity(token1, token2, amount, maxSellPrice)
        .signAndSend(account, { signer: signer }, (/*{ events, status }*/) => {
          context.dispatch("getSpotPrice");
        });
    }
  },
  withdrawLiquidity: async context => {
    const api = Api.getApi();
    const state = context.state;
    const account = state.account;
    const token1 = state.liquidityProperties.token1;
    const token2 = state.liquidityProperties.token2;

    if (api && account && state.selectedPool) {
      const signer = await Api.getSinger(account);
      const percentage = bnToBn(state.liquidityAmount.inputAmount);
      const shareToken = state.poolInfo[state.selectedPool].shareToken;
      const liquidityBalance = state.assetBalances[shareToken].balance;
      const liquidityToRemove = liquidityBalance
        .div(bnToBn(100))
        .mul(percentage);

      api.tx.amm
        .removeLiquidity(token1, token2, liquidityToRemove)
        .signAndSend(account, { signer: signer }, (/*{ events, status }*/) => {
          context.dispatch("getSpotPrice");
        });
    }
  },
  swap: async context => {
    const api = Api.getApi();
    const account = context.state.account;
    const amount = context.state.tradeAmount.amount;
    const token1 = context.state.tradeProperties.token1;
    const token2 = context.state.tradeProperties.token2;
    const actionType = context.state.tradeProperties.actionType;
    const currentIndex = currentTransactionIndex;

    if (api && account && amount && token1 != null && token2 != null) {
      context.commit("updateTransaction", {
        index: currentIndex,
        accountId: account,
        tokenIn: token1,
        tokenOut: token2,
        amountIn: formatBalance(amount),
        expectedOut: context.state.sellPrice.amountFormatted,
        type: actionType,
        progress: 0
      });

      currentTransactionIndex++;

      const signer = await Api.getSinger(account);
      if (actionType === "buy") {
        api.tx.exchange
          .buy(token1, token2, amount, false)
          .signAndSend(account, { signer: signer }, ({ events, status }) => {
            context.dispatch("updateTransactions", {
              events,
              currentIndex,
              status
            });
            context.dispatch("getSpotPrice");
            context.dispatch("getSellPrice");
          })
          .catch(() => {
            context.commit("updateTransaction", {
              index: currentIndex,
              progress: 5
            });
          });
      } else {
        api.tx.exchange
          .sell(token1, token2, amount, false)
          .signAndSend(account, { signer: signer }, ({ events, status }) => {
            context.dispatch("updateTransactions", {
              events,
              currentIndex,
              status
            });
            context.dispatch("getSpotPrice");
            context.dispatch("getSellPrice");
          })
          .catch(() => {
            context.commit("updateTransaction", {
              index: currentIndex,
              progress: 5
            });
          });
      }
    }
  },
  // GET ASSET BALANCES
  // BEWARE OF BASE ASSET
  syncAssetBalances: async context => {
    const api = Api.getApi();
    const account = context.state.account;
    const balances: AssetBalance[] = [];

    if (account && api) {
      const multiTokenInfo = await api.query.tokens.accounts.entries(account);
      const baseTokenInfo = await api.query.system.account(account);
      const baseTokenBalance = bnToBn(baseTokenInfo.data.free);

      balances[0] = {
        assetId: 0,
        balance: baseTokenBalance,
        balanceFormatted: formatBalance(baseTokenBalance)
      };
      multiTokenInfo.forEach(record => {
        let assetId = 99999;

        const assetInfo = record[0].toHuman();
        if (Array.isArray(assetInfo) && typeof assetInfo[1] === "string") {
          assetId = parseInt(assetInfo[1]);
        }

        const assetBalances = api.createType("AccountData", record[1]);
        const balance = bnToBn(assetBalances.free);
        const balanceFormatted = formatBalance(balance);

        balances[assetId] = {
          assetId,
          balance,
          balanceFormatted
        };
      });
    }

    context.commit("setAssetBalances", balances);
  },

  // GET LIST OF ALL POOLS
  // GET LIST OF SHARE TOKENS
  syncPools: async context => {
    const api = Api.getApi();
    if (!api) return;
    const allPools = await api.query.amm.poolAssets.entries();
    const allTokens = await api.query.amm.shareToken.entries();

    const poolInfo: {
      [key: string]: {
        poolAssets: number[];
        shareToken: number;
      };
    } = {};

    const shareTokenIds: number[] = [];
    const tokenTradeMap: TokenTradeMap = [];

    allPools.forEach(([key, value]) => {
      const poolId = key.toHuman()?.toString() || "ERR";
      const poolAssets = api
        .createType("Vec<u32>", value)
        .map(assetId => assetId.toNumber())
        .sort((a, b) => a - b);

      poolAssets.forEach((asset, key) => {
        const otherAsset = poolAssets[+!key];

        if (!tokenTradeMap[asset]) tokenTradeMap[asset] = [];
        if (tokenTradeMap[asset].indexOf(otherAsset) === -1) {
          tokenTradeMap[asset].push(otherAsset);
        }
      });

      poolInfo[poolId] = {
        poolAssets,
        shareToken: 99999
      };
    });

    allTokens.forEach(([key, value]) => {
      const poolId = key.toHuman()?.toString() || "ERR";
      const shareToken = api.createType("u32", value).toNumber();

      shareTokenIds.push(shareToken);

      poolInfo[poolId].shareToken = shareToken;
    });

    context.commit("updateTokenTradeMap", tokenTradeMap);
    context.commit("setShareTokenIds", shareTokenIds);
    context.commit("updatePoolInfo", poolInfo);
  },

  // GET LIST OF ALL ASSETS ON THE CHAIN
  // BEWARE OF TRANSFERS AND BALANCES WITH BASE ASSET
  syncAssetList: async context => {
    const api = Api.getApi();
    if (!api) return;
    const assetIds = await api.query.assetRegistry.assetIds.entries();
    const assetList: AssetRecord[] = [{ assetId: 0, name: "HDX" }];

    // TODO: Better way to parse mapped records
    assetIds.forEach(([assetName, id]) => {
      const assetId = parseInt(api.createType("Option<u32>", id).toString());
      const name = assetName.toHuman()?.toString() || "0xERR";

      assetList[assetId] = { assetId, name };
    });

    context.commit("updateAssetList", assetList);
  },

  // SYNCING OF POLKADOT.{js} WALLET
  updateWalletInfo: (context, accountsWithMeta: InjectedAccountWithMeta[]) => {
    const accounts = accountsWithMeta.map(account => {
      return {
        address: account.address.toString(),
        name: account.meta.name?.toString()
      };
    });
    context.commit("setExtensionPresent", true);

    if (!context.state.savedScreen) {
      context.commit("setScreen", "wallet");
    }
    if (accounts.length) {
      context.commit("setAccountList", accounts);
      if (
        context.state.account &&
        !accounts.find(x => x.address === context.state.account)
      ) {
        localStorage.removeItem("account");
        context.dispatch("changeAccount", null);
      }
    } else {
      localStorage.removeItem("account");
      context.dispatch("changeAccount", null);
      context.commit("setAccountList", []);
    }
  },
  // TODO: PARSE TRADES FROM EVENTS
  updateTransactions: (
    context,
    {
      events,
      currentIndex,
      status
    }: {
      events: EventRecord[];
      currentIndex?: number;
      status?: ExtrinsicStatus;
    }
  ) => {
    //TODO: BETTER HANDLING | SPLIT LOGIC
    events.forEach(({ event: { data, method } }) => {
      console.log("status", status?.toHuman(), method, currentIndex);
      if (method === "IntentionRegistered") {
        if (status && status.isInBlock) {
          const parsedData = data.toJSON();
          if (Array.isArray(parsedData) && parsedData.length === 6) {
            const id = parsedData[5]?.toString();
            context.commit("updateTransaction", {
              id: id,
              index: currentIndex,
              progress: 2
            });
          }
        }
      }
      if (
        method === "ExtrinsicFailed" &&
        currentIndex != null &&
        status?.isInBlock
      ) {
        console.log("fail", status?.toHuman());
        context.commit("updateTransaction", {
          id: Math.random(),
          index: currentIndex,
          progress: 4
        });
      }
      // if (method === "IntentionResolvedAMMTrade") {
      //   if (status && status.isInBlock) {
      //     console.log("inblock, TX#", currentId);
      //     const parsedData = data.toJSON();
      //     if (Array.isArray(parsedData) && parsedData.length === 6) {
      //       const id = parsedData[5]?.toString();

      //       state.transactions[currentId].id = id;
      //       if (state.transactions[currentId].progress < 2) {
      //         state.transactions[currentId].progress = 2;
      //       }
      //     }
      //   }
      // }
    });
  }
};
