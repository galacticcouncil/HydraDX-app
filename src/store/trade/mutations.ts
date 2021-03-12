import { MutationTree } from 'vuex';
import { formatBalanceAmount } from '@/services/utils';
import Vue from 'vue';

export const mutations: MutationTree<TradeState> & TradeMutations = {
  SET_SELL_PRICE_TIMER__TRADE(state, timer) {
    state.polling.real = timer;
  },
  SET_SPOT_PRICE_TIMER__TRADE(state, timer) {
    state.polling.spot = timer;
  },
  SET_SHARE_TOKEN_IDS__TRADE(state, shareTokenIds) {
    state.shareTokenIds = shareTokenIds;
  },
  SET_TRADE_AMOUNT__TRADE(state, tradeAmount) {
    state.tradeAmount = tradeAmount;
  },
  SET_TRADE_PROPERTIES__TRADE(state, tradeProperties) {
    state.tradeProperties = {
      ...state.tradeProperties,
      ...tradeProperties,
    };
  },
  UPDATE_TRANSACTIONS__TRADE(state, transaction) {
    if (transaction.id != null) {
      let transactionData;
      if (transaction.index != null) {
        transactionData = { ...state.unpairedTransactions[transaction.index] };

        const updatedUnpairedTransactionsScope: Transactions = {};

        for (const itemIndex in state.unpairedTransactions) {
          if (itemIndex != transaction.index) {
            updatedUnpairedTransactionsScope[itemIndex] =
              state.unpairedTransactions[itemIndex];
          }
        }
        state.unpairedTransactions = { ...updatedUnpairedTransactionsScope };
      }

      /**
       * We could get unsorted transaction data the progress should always be
       * the highest (errors being 4 and 5)
       */
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

      state.transactions = {
        ...state.transactions,
        [transaction.id]: transactionData,
      };
    } else if (transaction.index != null) {
      state.unpairedTransactions = {
        ...state.unpairedTransactions,
        [transaction.index]: {
          ...state.unpairedTransactions[transaction.index],
          ...transaction,
        },
      };
    }
  },

  UPDATE_SELL_PRICE__TRADE(state, sellPrice) {
    // state.sellPrice = formatBalanceAmount(sellPrice);
    state.sellPrice = sellPrice;
  },
  UPDATE_SPOT_PRICE__TRADE(state, spotPrice) {
    // state.spotPrice = formatBalanceAmount(spotPrice);
    state.sellPrice = spotPrice;
  },
  UPDATE_TOKEN_TRADE_MAP__TRADE(state, tokenTradeMap) {
    state.tokenTradeMap = tokenTradeMap;
  },
};
