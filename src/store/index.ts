import Vue from "vue";
import Vuex from "vuex";
import Api from "../api";
import { ApiPromise } from "@polkadot/api";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
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
  balance: number;
  balanceFormatted: string;
};

type TokenTradeMap = number[][];

type State = {
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
      shareToken: number;
    };
  };
  subscriptions: [];
  shareTokens: number[];
  spotPrice: number;
  tokenTradeMap: TokenTradeMap;
  tradeAmount: {
    amount: number;
    inputAmount: number;
    amountFormatted: string;
  };
  tradeProperties: {
    token1: number | null;
    token2: number | null;
    tradeType: string;
  };
  tradePrice: {
    price: number;
    priceFormatted: string;
  };
  polling: {
    spot: NodeJS.Timeout | null;
    real: NodeJS.Timeout | null;
  };
};

Vue.use(Vuex);

const decimalPlaces = 12;

const savedAccount = localStorage.getItem("account");

const store = new Vuex.Store<State>({
  state: {
    account: savedAccount || null,
    accountList: [],
    assetBalances: [],
    assetList: [],
    blockHash: null,
    blockNumber: 0,
    currentScreen: "initial",
    extensionInitialized: false,
    extensionPresent: true,
    poolInfo: {},
    subscriptions: [],
    shareTokens: [],
    spotPrice: 0,
    tokenTradeMap: [],
    tradeAmount: {
      amount: 0,
      inputAmount: 0,
      amountFormatted: "0"
    },
    tradeProperties: {
      token1: null,
      token2: null,
      tradeType: "buy"
    },
    tradePrice: {
      price: 0,
      priceFormatted: "0"
    },
    polling: {
      spot: null,
      real: null
    }
  },
  actions: {
    mintAsset: async (context, assetId) => {
      const api = Api.getApi();
      const account = context.state.account;
      if (api && account) {
        const signer = await Api.getSinger(account);
        api.tx.faucet
          .mint(assetId, 100000000000000)
          .signAndSend(account, { signer: signer }, result => {
            console.log("SIGN AND SEND RESULT:", result);
          });
      }
    },
    getSpotPrice: async context => {
      const api = Api.getApi();
      if (context.state.polling.spot) clearTimeout(context.state.polling.spot);
      if (api) {
        const timeout = setTimeout(() => {
          const spotPrice = 0.5;
          // await api.query.amm.getSpotPrice(
          //  context.state.tradeProperties.token1,
          //  context.state.tradeProperties.token2
          // );
          console.log(spotPrice);
          context.commit("setSpotPrice", spotPrice);
        }, 200);
        context.commit("setSpotPriceTimer", timeout);
      }
    },
    getSalePrice: async context => {
      const api = Api.getApi();
      if (context.state.polling.real) clearTimeout(context.state.polling.real);
      if (api) {
        const timeout = setTimeout(() => {
          const sellPrice = api.createType(
            "Balance",
            context.state.tradeAmount.amount / 2
          );
          // await api.query.amm.getSpotPrice(
          //  context.state.tradeProperties.token1,
          //  context.state.tradeProperties.token2,
          //  context.state.tradeAmount.amount
          // );
          const tradePrice = {
            price: sellPrice,
            priceFormatted: formatBalance(sellPrice)
          };
          console.log(sellPrice);
          context.commit("setTradePrice", tradePrice);
        }, 200);
        context.commit("setSalePriceTimer", timeout);
      }
    },
    swap: async context => {
      const api = Api.getApi();
      const account = context.state.account;
      const amount = context.state.tradeAmount.amount;
      const token1 = context.state.tradeProperties.token1;
      const token2 = context.state.tradeProperties.token2;
      const tradeType = context.state.tradeProperties.tradeType;

      if (api && account) {
        const signer = await Api.getSinger(account);
        if (tradeType === "buy") {
          api.tx.exchange
            .buy(token1, token2, amount, false)
            .signAndSend(account, { signer: signer }, result => {
              console.log("BOY RESULT:", result);
            });
        } else {
          api.tx.exchange
            .sell(token1, token2, amount, false)
            .signAndSend(account, { signer: signer }, result => {
              console.log("SELL RESULT:", result);
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
    assetBalances: ({ assetList, assetBalances }) => {
      if (!assetList) return [];

      // TODO: Faster algo
      const balances = assetList.map(assetRecord => {
        const tokenInfo = assetBalances.find(
          x => x && x.assetId == assetRecord.assetId
        );
        const balance = tokenInfo?.balance;
        const balanceFormatted = tokenInfo?.balanceFormatted;

        return {
          ...assetRecord,
          balance: balance || 0,
          balanceFormatted: balanceFormatted || 0
        };
      });
      return balances;
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
    poolInfo: ({ poolInfo }) => poolInfo,
    spotPrice: ({ spotPrice }) => spotPrice,
    tokenTradeMap: ({ tokenTradeMap }) => {
      return tokenTradeMap;
    },
    tradeAmount: ({ tradeAmount }) => tradeAmount,
    tradePrice: ({ tradePrice }) => tradePrice,
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
      state.currentScreen = screen;
    },
    setShareTokens(state, shareTokens) {
      state.shareTokens = shareTokens;
    },
    setSpotPrice(state, spotPrice) {
      state.spotPrice = spotPrice;
    },
    setSalePriceTimer(state, timer) {
      state.polling.real = timer;
    },
    setSpotPriceTimer(state, timer) {
      state.polling.spot = timer;
    },
    setTradeAmount(state, tradeAmount) {
      const amount = tradeAmount * Math.pow(10, decimalPlaces);
      state.tradeAmount = {
        amount: amount,
        inputAmount: tradeAmount,
        amountFormatted: formatBalance(amount)
      };
      store.dispatch("getSalePrice");
    },
    setTradePrice(state, tradePrice) {
      state.tradePrice = tradePrice;
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
  store.commit("setScreen", "wallet");
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
    const baseTokenBalance = baseTokenInfo.data.free.toNumber();

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
      const balance = assetBalances.free.toNumber();
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

  const shareTokens: number[] = [];
  const tokenTradeMap: TokenTradeMap = [];

  allPools.forEach(([key, value]) => {
    const poolId = key.toHuman()?.toString() || "ERR";
    const poolAssets = api
      .createType("Vec<u32>", value)
      .map(assetId => assetId.toNumber());

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

    shareTokens.push(shareToken);

    poolInfo[poolId].shareToken = shareToken;
  });

  store.commit("updateTokenTradeMap", tokenTradeMap);
  store.commit("setShareTokens", shareTokens);
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
