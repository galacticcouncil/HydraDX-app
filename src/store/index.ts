import Vue from "vue";
import Vuex from "vuex";
import Api from "../api";
import { ApiPromise } from "@polkadot/api";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

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
};

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
  subscriptions: [];
};

Vue.use(Vuex);

const savedAccount = localStorage.getItem("account");
console.log(savedAccount);

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
    subscriptions: []
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
        const balance = assetBalances.find(
          x => x.assetId === assetRecord.assetId
        )?.balance;

        return {
          ...assetRecord,
          balance: balance || 0
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
    }
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
    updateAssetList(state, assetList) {
      state.assetList = assetList;
    },
    updateBlockInfo(state, { blockNumber, blockHash }) {
      state.blockNumber = blockNumber;
      state.blockHash = blockHash;
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
    // console.log(multiTokenInfo);
    // console.log(baseTokenInfo);
  }

  store.commit("setAssetBalances", balances);
};

// GET LIST OF ALL ASSETS ON THE CHAIN
// BEWARE OF TRANSFERS AND BALANCES WITH BASE ASSET
const syncAssetList = async (api: ApiPromise) => {
  const assetIds = await api.query.assetRegistry.assetIds.entries();
  const assetList: AssetRecord[] = [{ assetId: 0, name: "HDX" }];

  // TODO: Better way to parse mapped records
  assetIds.forEach(assetData => {
    const assetRecord: AssetRecord = {
      assetId: 9999,
      name: "HHHH"
    };

    assetData.forEach(record => {
      const humanizedRecord = record.toHuman();
      if (Array.isArray(humanizedRecord) && humanizedRecord[0]) {
        assetRecord.name = humanizedRecord[0].toString();
      } else if (typeof humanizedRecord === "string") {
        assetRecord.assetId = parseInt(humanizedRecord);
      }
    });
    assetList[assetRecord.assetId] = assetRecord;
  });

  store.commit("updateAssetList", assetList);

  setTimeout(() => {
    syncAssetList(api);
  }, 60 * 1000);
};

Api.initialize().then(async api => {
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

    store.commit("updateBlockInfo", {
      blockNumber: header.number.toNumber(),
      blockHash: header.hash.toString()
    });
  });

  syncAssetList(api);
});

export default store;
