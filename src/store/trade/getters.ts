import { GetterTree } from 'vuex';

export const getters: GetterTree<TradeState, MergedState> & TradeGetters = {
  spotPrice: ({ spotPrice }) => spotPrice,
  tokenTradeMap: ({ tokenTradeMap }) => {
    return tokenTradeMap;
  },
  tradeAmount: ({ tradeAmount }) => tradeAmount,
  sellPrice: ({ sellPrice }) => sellPrice,
  transactionList: ({ transactions, unpairedTransactions }) => {
    const allTransactions = { ...transactions };
    for (const transaction in unpairedTransactions) {
      const id = 'unpaired' + Math.random();
      const transactionData = unpairedTransactions[transaction];
      transactionData.id = id;
      allTransactions[id] = transactionData;
    }

    return allTransactions;
  },
  tradeProperties: ({ tradeProperties }) => tradeProperties,
};
