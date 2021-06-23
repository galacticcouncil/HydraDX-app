import { MutationTree } from 'vuex';
import { formatBalanceAmountBigN } from '@/services/utils';

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
    if (transaction.data.id !== null && transaction.data.id !== undefined) {
      state.transactions = {
        ...state.transactions,
        [transaction.data.id]: transaction,
      };
    }
  },

  UPDATE_SELL_PRICE__TRADE(state, sellPrice) {
    state.sellPrice = formatBalanceAmountBigN(sellPrice);
  },
  UPDATE_SPOT_PRICE__TRADE(state, spotPrice) {
    state.spotPrice = formatBalanceAmountBigN(spotPrice);
  },
  UPDATE_TOKEN_TRADE_MAP__TRADE(state, tokenTradeMap) {
    state.tokenTradeMap = tokenTradeMap;
  },
  SET_TRADE_SLIPPAGE_PERCENTAGE__TRADE(state, slippage) {
    state.tradeSlippagePercentage = slippage;
  },
};
