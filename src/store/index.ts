import Vue from "vue";
import Vuex from "vuex";
import Api from "../api";

import { bnToBn } from "@polkadot/util";
import { formatBalance } from "@polkadot/util";

import { actions } from "./actions";
import { getters } from "./getters";
import { mutations } from "./mutations";

Vue.use(Vuex);

const savedAccount = localStorage.getItem("account");
const savedScreen = localStorage.getItem("screen");

const store = new Vuex.Store<State>({
  state: {
    account: savedAccount || null,
    accountList: [],
    actions: [],
    assetBalances: [],
    assetList: [],
    blockHash: null,
    blockNumber: 0,
    currentScreen: savedScreen ? savedScreen : "initial",
    extensionInitialized: false,
    extensionPresent: true,
    liquidityAmount: bnToBn(0),
    liquidityProperties: {
      actionType: "add",
      token1: null,
      token2: null,
    },
    pendingAction: false,
    polling: {
      real: null,
      spot: null,
    },
    poolInfo: {},
    savedScreen: savedScreen ? true : false,
    selectedPool: null,
    sellPrice: {
      amount: bnToBn(0),
      amountFormatted: "0",
      inputAmount: 0,
    },
    shareTokenIds: [],
    spotPrice: {
      amount: bnToBn(0),
      amountFormatted: "0",
      inputAmount: 0,
    },
    subscriptions: [],
    tokenTradeMap: [],
    tradeAmount: bnToBn(0),
    tradeProperties: {
      actionType: "buy",
      token1: null,
      token2: null,
    },
    transactions: {},
    unpairedTransactions: {},
  },
  actions,
  getters,
  mutations,
});

// API INITIALIZATION
Api.initialize().then(async (api) => {
  // INITIALIZE HELPERS
  formatBalance.setDefaults({
    decimals: 12,
    unit: "",
  });

  const int = api.createType("FixedU128", "100000000000000");
  console.log(int.toHuman());
  // INITIALIZE WALLET
  store.commit("setExtensionPresent", false);
  Api.syncWallets((payload) => {
    store.dispatch("updateWalletInfo", payload);
  }).then(async (accountSubscription) => {
    if (accountSubscription) {
      store.commit("setExtensionPresent", true);
    }
    store.commit("setExtensionInitialized", true);
  });

  api.query.system.events((events) => {
    // const eventsMap = events.map(record => {
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
    //   // event.data.forEach((data, index) => {
    //   //   console.log(`\t\t\t${types[index].type}: ${data.toString()}`);
    //   // });
    //   //}
    //   return event;
    // });
    console.log("eventsMap", events);
    store.dispatch("updateTransactions", { events: events });
  });

  api.rpc.chain.subscribeNewHeads((header) => {
    store.dispatch("syncAssetBalances");
    store.dispatch("syncAssetList");
    store.dispatch("syncPools");
    store.commit("setPendingAction", false);
    store.commit("updateBlockInfo", {
      blockNumber: header.number.toNumber(),
      blockHash: header.hash.toString(),
    });
  });
});

export default store;
