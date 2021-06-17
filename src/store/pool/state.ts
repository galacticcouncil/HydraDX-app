import BigNumber from 'bignumber.js';

export const state: PoolState = {
  liquidityAmount: new BigNumber(0),
  liquidityProperties: {
    actionType: 'add',
    asset1: null,
    asset2: null,
  },
  poolInfo: {},
  selectedPool: null,

  newPoolProperties: {
    asset1: null,
    asset2: null,
    initialPrice: new BigNumber(0),
    amount: new BigNumber(0),
  },

  createPoolDialogOpen: false,

  addRemovePoolLiquidityDialogOpen: false,
};
