import { GetterTree } from 'vuex';

export const getters: GetterTree<TradeState, MergedState> & TradeGetters = {
  spotPriceSMTrade: ({ spotPrice }) => spotPrice,
  tokenTradeMapSMTrade: ({ tokenTradeMap }) => {
    return tokenTradeMap;
  },
  tradeAmountSMTrade: ({ tradeAmount }) => tradeAmount,
  sellPriceSMTrade: ({ sellPrice }) => sellPrice,
  transactionListSMTrade: ({ transactions, unpairedTransactions }) => {
    const allTransactions = { ...transactions };
    for (const transaction in unpairedTransactions) {
      const id = 'unpaired' + Math.random();
      const transactionData = unpairedTransactions[transaction];
      transactionData.id = id;
      allTransactions[id] = transactionData;
    }

    return allTransactions;
  },
  tradePropertiesSMTrade: ({ tradeProperties }) => tradeProperties,
  tradeSlippagePercentageSMTrade: ({ tradeSlippagePercentage }) =>
    tradeSlippagePercentage,
};
