import { MutationTree } from "vuex";
import { formatBalanceAmount } from "./util";
import Vue from "vue";

export const mutations: MutationTree<State> = {
  setAccount(state, account) {
    state.account = account;
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
    state.selectedPool = poolId;
  },
  setSellPriceTimer(state, timer) {
    state.polling.real = timer;
  },
  setSpotPriceTimer(state, timer) {
    state.polling.spot = timer;
  },
  setLiquidityAmount(state, liquidityAmount) {
    state.liquidityAmount = liquidityAmount;
  },
  setTradeAmount(state, tradeAmount) {
    state.tradeAmount = tradeAmount;
  },
  setLiquidityProperties(state, liquidityProperties) {
    state.liquidityProperties = {
      ...state.liquidityProperties,
      ...liquidityProperties,
    };
  },
  setTradeProperties(state, tradeProperties) {
    state.tradeProperties = {
      ...state.tradeProperties,
      ...tradeProperties,
    };
  },
  updateTransaction(state, transaction: Transaction) {
    if (transaction.id != null) {
      let transactionData;
      if (transaction.index != null) {
        transactionData = { ...state.unpairedTransactions[transaction.index] };
        delete state.unpairedTransactions[transaction.index];
        Vue.delete(state.unpairedTransactions, transaction.index);
      }

      // We could get unsorted transaction data the progress should always be the highest (errors being 4 and 5)
      const progress = Math.max(
        transaction.progress,
        transactionData?.progress || 0,
        state.transactions[transaction.id]?.progress || 0
      );

      transactionData = {
        ...transactionData,
        ...state.transactions[transaction.id],
        ...transaction,
        progress,
      };

      Vue.set(state.transactions, transaction.id, transactionData);
    } else if (transaction.index != null) {
      Vue.set(state.unpairedTransactions, transaction.index, {
        ...state.unpairedTransactions[transaction.index],
        ...transaction,
      });
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
  },
};
