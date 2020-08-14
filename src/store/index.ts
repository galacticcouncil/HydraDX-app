import Vue from "vue";
import Vuex from "vuex";
import Api from "../api";
import { ApiPromise } from "@polkadot/api";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { bnToBn } from "@polkadot/util";
import BN from "bn.js";
import { EventRecord, ExtrinsicStatus } from "@polkadot/types/interfaces";
import { formatBalance } from "@polkadot/util";

type AccountInfo = {
  name: string;
  address: string;
};

type AssetRecord = {
  assetId: number;
  name: string;
  icon?: string;
};

type AssetBalance = {
  assetId: number;
  balance: BN;
  balanceFormatted: string;
};

type AssetAmount = {
  amount: BN;
  inputAmount: number;
  amountFormatted: string;
};

type Transaction = {
  //USERID || TXID?
  [key: string]: {
    progress: string;
    block: number;
    type: string;
    tokenIn: number;
    tokenOut: number;
    expectedOut: number;
    matchIn: number;
    matchOut: number;
  };
};

type TokenTradeMap = number[][];

type State = {
  actions: [];
  account: string | null;
  accountList: AccountInfo[];
  assetBalances: AssetBalance[];
  assetList: AssetRecord[];
  blockHash: string | null;
  blockNumber: number;
  currentScreen: string;
  extensionInitialized: boolean;
  extensionPresent: boolean;
  poolInfo: {
    [key: string]: {
      poolAssets: number[];
      poolAssetNames: string[];
      shareToken: number;
    };
  };
  subscriptions: [];
  shareTokenIds: number[];
  selectedPool: string | null;
  sellPrice: AssetAmount;
  spotPrice: AssetAmount;
  tokenTradeMap: TokenTradeMap;
  liquidityAmount: AssetAmount;
  tradeAmount: AssetAmount;
  liquidityProperties: {
    token1: number | null;
    token2: number | null;
    actionType: string;
  };
  tradeProperties: {
    token1: number | null;
    token2: number | null;
    actionType: string;
  };
  polling: {
    spot: NodeJS.Timeout | null;
    real: NodeJS.Timeout | null;
  };
  transactions: Transaction[];
};

Vue.use(Vuex);

const decimalPlaces = 12;

const savedAccount = localStorage.getItem("account");
const savedScreen = localStorage.getItem("screen");
const bnDecimals = bnToBn(decimalPlaces);
//TODO: Precision
const baseAmount = bnToBn(10).pow(bnDecimals.sub(bnToBn(4)));

const formatInputAmount = (amount: number) => {
  const normalAmount = amount
    ? bnToBn(Math.round(amount * 10 ** 4)).mul(baseAmount)
    : bnToBn(0);
  return {
    amount: normalAmount,
    inputAmount: amount,
    amountFormatted: formatBalance(normalAmount)
  };
};

const formatBalanceAmount = (balance: BN) => {
  const bnDecimals = bnToBn(decimalPlaces);
  //TODO: Precision
  const baseAmount = bnToBn(10).pow(bnDecimals.sub(bnToBn(4)));
  const inputAmount = balance.div(baseAmount).toNumber() / 10 ** 4;
  return {
    amount: balance,
    inputAmount: inputAmount,
    amountFormatted: formatBalance(balance)
  };
};

// PARSE EVENTS FROM TRADES
const mapEventsToTrades = (events: EventRecord[], status: ExtrinsicStatus) => {
  //console.log("events", status, events);
  // if (status) {
  //   // Loop through Vec<EventRecord> to display all events
  //   events.forEach(({ phase, event: { data, method, section } }) => {
  //     console.log("READY");
  //     console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
  //   });
  // }
  //unsub();
};

const store = new Vuex.Store<State>({
  state: {
    actions: [],
    account: savedAccount || null,
    accountList: [],
    assetBalances: [],
    assetList: [],
    blockHash: null,
    blockNumber: 0,
    currentScreen: savedScreen ? savedScreen : "initial",
    extensionInitialized: false,
    extensionPresent: true,
    poolInfo: {},
    subscriptions: [],
    shareTokenIds: [],
    selectedPool: null,
    sellPrice: {
      amount: bnToBn(0),
      inputAmount: 0,
      amountFormatted: "0"
    },
    spotPrice: {
      amount: bnToBn(0),
      inputAmount: 0,
      amountFormatted: "0"
    },
    tokenTradeMap: [],
    liquidityAmount: {
      amount: bnToBn(0),
      inputAmount: 0,
      amountFormatted: "0"
    },
    tradeAmount: {
      amount: bnToBn(0),
      inputAmount: 0,
      amountFormatted: "0"
    },
    liquidityProperties: {
      token1: null,
      token2: null,
      actionType: "add"
    },
    tradeProperties: {
      token1: null,
      token2: null,
      actionType: "buy"
    },
    polling: {
      spot: null,
      real: null
    },
    transactions: []
  },
  actions: {
    mintAsset: async (context, assetId) => {
      const api = Api.getApi();
      const account = context.state.account;
      if (api && account) {
        const signer = await Api.getSinger(account);
        api.tx.faucet
          .mint(assetId, 100000000000000)
          .signAndSend(
            account,
            { signer: signer },
            (/*{ events, status }*/) => {
              // TODO:STUFF
            }
          );
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
      const maxSellPrice = amount.mul(bnToBn(spotPrice * 1.1));

      if (api && account) {
        const signer = await Api.getSinger(account);
        api.tx.amm
          .addLiquidity(token1, token2, amount, maxSellPrice)
          .signAndSend(
            account,
            { signer: signer },
            (/*{ events, status }*/) => {
              context.dispatch("getSpotPrice");
            }
          );
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
          .signAndSend(
            account,
            { signer: signer },
            (/*{ events, status }*/) => {
              context.dispatch("getSpotPrice");
            }
          );
      }
    },
    swap: async context => {
      const api = Api.getApi();
      const account = context.state.account;
      const amount = context.state.tradeAmount.amount;
      const token1 = context.state.tradeProperties.token1;
      const token2 = context.state.tradeProperties.token2;
      const actionType = context.state.tradeProperties.actionType;

      if (api && account) {
        const signer = await Api.getSinger(account);
        if (actionType === "buy") {
          api.tx.exchange
            .buy(token1, token2, amount, false)
            .signAndSend(account, { signer: signer }, ({ events, status }) => {
              mapEventsToTrades(events, status);
              context.dispatch("getSpotPrice");
              context.dispatch("getSellPrice");
            });
        } else {
          api.tx.exchange
            .sell(token1, token2, amount, false)
            .signAndSend(account, { signer: signer }, ({ events, status }) => {
              mapEventsToTrades(events, status);
              context.dispatch("getSpotPrice");
              context.dispatch("getSellPrice");
            });
        }
      }
    }
  },
  modules: {},
  getters: {
    account: ({ account }) => account,
    accountInfo: ({ account, accountList }) => {
      return accountList.find(x => x.address === account);
    },
    accountList: ({ accountList }) => accountList,
    assetBalances: ({ assetList, assetBalances, shareTokenIds, poolInfo }) => {
      if (!assetList) return [];

      // TODO: Faster algo
      const balances = assetList.map(assetRecord => {
        const tokenInfo = assetBalances.find(
          x => x && x.assetId == assetRecord.assetId
        );
        let name = assetRecord.name;
        const shareToken = shareTokenIds.includes(assetRecord.assetId);
        if (shareToken) {
          for (const key in poolInfo) {
            const pool = poolInfo[key];
            if (pool.shareToken === assetRecord.assetId) {
              name = pool.poolAssets
                .map(asset => assetList.find(x => x && x.assetId == asset))
                .map(x => x?.name)
                .join(" | ");
              break;
            }
          }
        }
        const balance = tokenInfo?.balance;
        const balanceFormatted = tokenInfo?.balanceFormatted;

        return {
          ...assetRecord,
          name,
          shareToken,
          balance: balance || 0,
          balanceFormatted: balanceFormatted || 0
        };
      });
      return balances.sort((a, b) => Number(b.balance) - Number(a.balance));
    },
    assetList: ({ assetList }) => assetList,
    blockInfo: ({ blockNumber, blockHash }) => {
      return {
        blockNumber,
        blockHash
      };
    },
    currentScreen: ({ currentScreen }) => currentScreen,
    extensionInfo: ({ extensionInitialized, extensionPresent }) => {
      return {
        extensionInitialized,
        extensionPresent
      };
    },
    poolInfo: ({ poolInfo }) => {
      const assetList = store.state.assetList;
      for (const pool in poolInfo) {
        poolInfo[pool].poolAssetNames = [];
        poolInfo[pool].poolAssetNames[0] =
          assetList[poolInfo[pool].poolAssets[0]].name;
        poolInfo[pool].poolAssetNames[1] =
          assetList[poolInfo[pool].poolAssets[1]].name;
      }
      return poolInfo;
    },
    spotPrice: ({ spotPrice }) => spotPrice,
    tokenTradeMap: ({ tokenTradeMap }) => {
      return tokenTradeMap;
    },
    tradeAmount: ({ tradeAmount }) => tradeAmount,
    sellPrice: ({ sellPrice }) => sellPrice,
    tradeProperties: ({ tradeProperties }) => tradeProperties
  },
  mutations: {
    setAccount(state, account) {
      state.account = account;
      store.commit("setAssetBalances", []);
      localStorage.setItem("account", account);
    },
    setAccountList(state, accountList) {
      state.accountList = accountList;
    },
    setAssetBalances(state, assetBalances) {
      state.assetBalances = assetBalances;
    },
    setExtensionPresent(state, extensionPresent) {
      state.extensionPresent = extensionPresent;
    },
    setExtensionInitialized(state, extensionInitialized) {
      state.extensionInitialized = extensionInitialized;
    },
    setScreen(state, screen) {
      localStorage.setItem("screen", screen);
      state.currentScreen = screen;
    },
    setShareTokenIds(state, shareTokenIds) {
      state.shareTokenIds = shareTokenIds;
    },
    setSelectedPool(state, poolId) {
      store.dispatch("getSpotPrice");
      state.selectedPool = poolId;
    },
    setSellPriceTimer(state, timer) {
      state.polling.real = timer;
    },
    setSpotPriceTimer(state, timer) {
      state.polling.spot = timer;
    },
    setLiquidityAmount(state, liquidityAmount) {
      state.liquidityAmount = formatInputAmount(liquidityAmount);
    },
    setTradeAmount(state, tradeAmount) {
      state.tradeAmount = formatInputAmount(tradeAmount);
      store.dispatch("getSellPrice");
    },
    setLiquidityProperties(state, liquidityProperties) {
      state.liquidityProperties = {
        ...state.liquidityProperties,
        ...liquidityProperties
      };
      store.dispatch("getSpotPrice");
    },
    setTradeProperties(state, tradeProperties) {
      state.tradeProperties = {
        ...state.tradeProperties,
        ...tradeProperties
      };

      if (
        state.tradeProperties.token1 != null &&
        state.tradeProperties.token2 != null
      ) {
        store.dispatch("getSellPrice");
        store.dispatch("getSpotPrice");
      }
    },
    updateAssetList(state, assetList) {
      state.assetList = assetList;
    },
    updateBlockInfo(state, { blockNumber, blockHash }) {
      state.blockNumber = blockNumber;
      state.blockHash = blockHash;
    },
    updatePoolInfo(state, poolInfo) {
      state.poolInfo = poolInfo;
    },
    updateSellPrice(state, sellPrice) {
      state.sellPrice = formatBalanceAmount(sellPrice);
    },
    updateSpotPrice(state, spotPrice) {
      state.spotPrice = formatBalanceAmount(spotPrice);
    },
    updateTokenTradeMap(state, tokenTradeMap) {
      state.tokenTradeMap = tokenTradeMap;
    }
  }
});

// SYNCING OF POLKADOT.{js} WALLET
const updateWalletInfo = (accountsWithMeta: InjectedAccountWithMeta[]) => {
  const accounts = accountsWithMeta.map(account => {
    return {
      address: account.address.toString(),
      name: account.meta.name?.toString()
    };
  });
  store.commit("setExtensionPresent", true);

  if (!savedScreen) {
    store.commit("setScreen", "wallet");
  }
  if (accounts.length) {
    store.commit("setAccountList", accounts);
    if (
      store.state.account &&
      !accounts.find(x => x.address === store.state.account)
    ) {
      localStorage.removeItem("account");
      store.commit("setAccount", null);
    }
  } else {
    localStorage.removeItem("account");
    store.commit("setAccount", null);
    store.commit("setAccountList", []);
  }
};

// GET ASSET BALANCES
// BEWARE OF BASE ASSET
const syncAssetBalances = async (api: ApiPromise) => {
  const account = store.state.account;
  const balances: AssetBalance[] = [];

  if (account) {
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

  store.commit("setAssetBalances", balances);
};

// GET LIST OF ALL POOLS
// GET LIST OF SHARE TOKENS
const syncPools = async (api: ApiPromise) => {
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

  store.commit("updateTokenTradeMap", tokenTradeMap);
  store.commit("setShareTokenIds", shareTokenIds);
  store.commit("updatePoolInfo", poolInfo);
};

// GET LIST OF ALL ASSETS ON THE CHAIN
// BEWARE OF TRANSFERS AND BALANCES WITH BASE ASSET
const syncAssetList = async (api: ApiPromise) => {
  const assetIds = await api.query.assetRegistry.assetIds.entries();
  const assetList: AssetRecord[] = [{ assetId: 0, name: "HDX" }];

  // TODO: Better way to parse mapped records
  assetIds.forEach(([assetName, id]) => {
    const assetId = parseInt(api.createType("Option<u32>", id).toString());
    const name = assetName.toHuman()?.toString() || "0xERR";

    assetList[assetId] = { assetId, name };
  });

  store.commit("updateAssetList", assetList);
};

// API INITIALIZATION
Api.initialize().then(async api => {
  // INITIALIZE HELPERS
  formatBalance.setDefaults({
    decimals: 12,
    unit: ""
  });

  // INITIALIZE WALLET
  store.commit("setExtensionPresent", false);
  Api.syncWallets(updateWalletInfo).then(async accountSubscription => {
    if (accountSubscription) {
      store.commit("setExtensionPresent", true);
    }
    store.commit("setExtensionInitialized", true);
  });

  api.query.system.events(events => {
    // events.forEach(record => {
    //   // Extract the phase, event and the event types
    //   const { event, phase } = record;
    //   const types = event.typeDef;
    //   //if (event.section === "exchange") {
    //   // Show what we are busy with
    //   console.log(
    //     `\t${event.section}:${event.method}:: (phase=${phase.toString()})`
    //   );
    //   console.log(`\t\t${event.meta.documentation.toString()}`);
    //   // Loop through each of the parameters, displaying the type and data
    //   event.data.forEach((data, index) => {
    //     console.log(`\t\t\t${types[index].type}: ${data.toString()}`);
    //   });
    //   //}
    // });
  });

  api.rpc.chain.subscribeNewHeads(header => {
    syncAssetBalances(api);
    syncAssetList(api);
    syncPools(api);

    store.commit("updateBlockInfo", {
      blockNumber: header.number.toNumber(),
      blockHash: header.hash.toString()
    });
  });
});

export default store;
