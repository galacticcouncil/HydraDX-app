import { bnToBn } from '@polkadot/util';
import * as BN from 'bn.js';

export const state: TradeState = {
  polling: {
    real: null,
    spot: null,
  },
  sellPrice: {
    amount: bnToBn(0),
    amountFormatted: '0',
    inputAmount: 0,
  },
  shareTokenIds: [],
  spotPrice: {
    amount: bnToBn(0),
    amountFormatted: '0',
    inputAmount: 0,
  },
  subscriptions: [],
  tokenTradeMap: [],
  tradeAmount: bnToBn(0) as BN,
  tradeProperties: {
    actionType: 'buy',
    asset1: null,
    asset2: null,
  },
  transactions: {},
  unpairedTransactions: {},
};
