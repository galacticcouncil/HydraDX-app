import { GetterTree } from 'vuex';

export const getters: GetterTree<SinglePoolState, MergedState> & SinglePoolGetters = {
  liquidityAmountSMSinglePool: ({ liquidityAmount }) => liquidityAmount,
  liquidityPropertiesSMSinglePool: ({ liquidityProperties }) => liquidityProperties,
  newPoolPropertiesSMSinglePool: ({ newPoolProperties }) => newPoolProperties,
  selectedPoolSMSinglePool: ({ selectedPool }) => selectedPool,
  createPoolDialogOpenSMSinglePool: ({ createPoolDialogOpen }) =>
    createPoolDialogOpen,
  addRemovePoolLiquidityDialogOpenSMSinglePool: ({
    addRemovePoolLiquidityDialogOpen,
  }) => addRemovePoolLiquidityDialogOpen,
};
