import { bnToBn } from '@polkadot/util';

export const state: PoolState = {
  liquidityAmount: bnToBn(0),
  liquidityProperties: {
    actionType: 'add',
    asset1: null,
    asset2: null,
  },
  poolInfo: {},
  selectedPool: null,
};
