import { ActionTree } from "vuex";
import Api from "../api";

import { bnToBn } from "@polkadot/util";
import { bnToDec, decToBn } from "./util";
import { formatBalance } from "@polkadot/util";
import { EventRecord, ExtrinsicStatus } from "@polkadot/types/interfaces";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

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
      context.state.tradeProperties.asset1 != null &&
      context.state.tradeProperties.asset2 != null
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
        .signAndSend(account, { signer: signer }, ({ events, status }) => {
          if (status.isReady) context.commit("setPendingAction", true);
          // TODO:STUFF
        });
    }
  },
  getSpotPrice: async (context) => {
    const api = Api.getApi();
    if (context.state.polling.spot) clearTimeout(context.state.polling.spot);
    if (api) {
      const state = context.state;
      const currentScreen = context.state.currentScreen;

      let asset1: number | null = null;
      let asset2: number | null = null;

      if (currentScreen === "trade") {
        asset1 = state.tradeProperties.asset1;
        asset2 = state.tradeProperties.asset2;
      } else if (currentScreen === "liquidity") {
        asset1 = state.liquidityProperties.asset1;
        asset2 = state.liquidityProperties.asset2;
      } else {
        return;
      }

      console.log(
        asset1,
        state.tradeProperties.asset1,
        asset2,
        state.tradeProperties.asset2,
        state.tradeAmount
      );

      const timeout = setTimeout(async () => {
        const amountData =
          // @ts-expect-error TS2339
          await api.rpc.amm.getSpotPrice(asset1, asset2, 1000000000000);

        const amount = amountData.amount;
        context.commit("updateSpotPrice", amount);
      }, 200);
      context.commit("setSpotPriceTimer", timeout);
    }
  },
  getSellPrice: async (context) => {
    const api = Api.getApi();
    if (context.state.polling.real) clearTimeout(context.state.polling.real);
    if (api) {
      const timeout = setTimeout(async () => {
        let amount = bnToBn(0);

        console.log(
          context.state.tradeProperties.asset1,
          context.state.tradeProperties.asset2,
          context.state.tradeAmount
        );
        if (context.state.tradeAmount) {
          if (context.state.tradeProperties.actionType === "sell") {
            // @ts-expect-error TS2339
            const amountData = await api.rpc.amm.getSellPrice(
              context.state.tradeProperties.asset1,
              context.state.tradeProperties.asset2,
              context.state.tradeAmount
            );

            amount = amountData.amount;
          } else {
            // @ts-expect-error TS2339
            const amountData = await api.rpc.amm.getBuyPrice(
              context.state.tradeProperties.asset1,
              context.state.tradeProperties.asset2,
              context.state.tradeAmount
            );

            amount = amountData.amount;
          }
        }
        context.commit("updateSellPrice", amount);
      }, 200);
      context.commit("setSellPriceTimer", timeout);
    }
  },
  addLiquidity: async (context) => {
    const api = Api.getApi();
    const account = context.state.account;
    const amount = context.state.liquidityAmount;
    const asset1 = context.state.liquidityProperties.asset1;
    const asset2 = context.state.liquidityProperties.asset2;
    const spotPrice = context.state.spotPrice.inputAmount;
    const maxSellPrice = decToBn(bnToDec(amount).multipliedBy(spotPrice * 1.1));

    if (api && account) {
      const signer = await Api.getSinger(account);
      api.tx.amm
        .addLiquidity(asset1, asset2, amount, maxSellPrice)
        .signAndSend(account, { signer: signer }, ({ events, status }) => {
          if (status.isReady) context.commit("setPendingAction", true);
          context.dispatch("getSpotPrice");
        });
    }
  },
  withdrawLiquidity: async (context) => {
    const api = Api.getApi();
    const state = context.state;
    const account = state.account;
    const asset1 = state.liquidityProperties.asset1;
    const asset2 = state.liquidityProperties.asset2;

    if (api && account && state.selectedPool) {
      const signer = await Api.getSinger(account);
      const percentage = state.liquidityAmount;
      const shareToken = state.poolInfo[state.selectedPool].shareToken;
      const liquidityBalance = state.assetBalances[shareToken].balance;
      const liquidityToRemove = liquidityBalance
        .div(bnToBn(100))
        .mul(percentage);

      api.tx.amm
        .removeLiquidity(asset1, asset2, liquidityToRemove)
        .signAndSend(account, { signer: signer }, ({ events, status }) => {
          if (status.isReady) context.commit("setPendingAction", true);
          context.dispatch("getSpotPrice");
        });
    }
  },
  swap: async (context) => {
    const api = Api.getApi();
    const account = context.state.account;
    const amount = context.state.tradeAmount;
    const asset1 = context.state.tradeProperties.asset1;
    const asset2 = context.state.tradeProperties.asset2;
    const actionType = context.state.tradeProperties.actionType;
    const currentIndex = Math.random();

    if (api && account && amount && asset1 != null && asset2 != null) {
      context.commit("updateTransaction", {
        index: currentIndex,
        accountId: account,
        tokenIn: asset1,
        tokenOut: asset2,
        amountIn: formatBalance(amount),
        expectedOut: context.state.sellPrice.amountFormatted,
        type: actionType,
        progress: 0,
      });

      const signer = await Api.getSinger(account);
      if (actionType === "buy") {
        api.tx.exchange
          //TODO: CALCULATE LIMITS FROM SPOT PRICE
          .buy(asset1, asset2, amount, bnToBn("100000000000000000"), false)
          .signAndSend(account, { signer: signer }, ({ events, status }) => {
            if (status.isReady) context.commit("setPendingAction", true);
            context.dispatch("updateTransactions", {
              events,
              currentIndex,
              status,
            });
            context.dispatch("getSpotPrice");
            context.dispatch("getSellPrice");
          })
          .catch(() => {
            context.commit("updateTransaction", {
              index: currentIndex,
              progress: 5,
            });
          });
      } else {
        api.tx.exchange
          //TODO: CALCULATE LIMITS FROM SPOT PRICE
          .sell(asset1, asset2, amount, bnToBn(1000), false)
          .signAndSend(account, { signer: signer }, ({ events, status }) => {
            if (status.isReady) context.commit("setPendingAction", true);
            context.dispatch("updateTransactions", {
              events,
              currentIndex,
              status,
            });
            context.dispatch("getSpotPrice");
            context.dispatch("getSellPrice");
          })
          .catch(() => {
            context.commit("updateTransaction", {
              index: currentIndex,
              progress: 5,
            });
          });
      }
    }
  },
  // GET ASSET BALANCES
  // BEWARE OF BASE ASSET
  syncAssetBalances: async (context) => {
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
        balanceFormatted: formatBalance(baseTokenBalance),
      };
      multiTokenInfo.forEach((record) => {
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
          balanceFormatted,
        };
      });
    }

    context.commit("setAssetBalances", balances);
  },

  // GET LIST OF ALL POOLS
  // GET LIST OF SHARE TOKENS
  syncPools: async (context) => {
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
    const tokenTradeMap: TokenTradeMap = {};

    allPools.forEach(([key, value]) => {
      const poolId = key.toHuman()?.toString() || "ERR";
      const poolAssets = api
        .createType("Vec<u32>", value)
        .map((assetId) => assetId.toNumber())
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
        shareToken: 99999,
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
  syncAssetList: async (context) => {
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
    const accounts = accountsWithMeta.map((account) => {
      return {
        address: account.address.toString(),
        name: account.meta.name?.toString(),
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
        !accounts.find((x) => x.address === context.state.account)
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
      status,
    }: {
      events: EventRecord[];
      currentIndex?: number;
      status?: ExtrinsicStatus;
    }
  ) => {
    if (!events) return;
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
              progress: 2,
            });
          }
        }
      }
      if (
        method === "ExtrinsicFailed" &&
        currentIndex != null &&
        status?.isInBlock
      ) {
        context.commit("updateTransaction", {
          id: Math.random(),
          index: currentIndex,
          progress: 4,
        });
      }
      if (method === "IntentionResolvedAMMTrade") {
        const parsedData = data.toJSON();
        if (Array.isArray(parsedData)) {
          const id = parsedData[2]?.toString();
          context.commit("updateTransaction", {
            id: id,
            progress: 3,
          });
        }
      }
      if (method === "IntentionResolvedDirectTrade") {
        //const account = context.state.account;
        //TODO: add amounts matched
        const parsedData = data.toJSON();
        if (Array.isArray(parsedData)) {
          context.commit("updateTransaction", {
            id: parsedData[3]?.toString(),
            progress: 3,
          });
          context.commit("updateTransaction", {
            id: parsedData[3]?.toString(),
            progress: 3,
          });
        }
      }
    });
  },
};
