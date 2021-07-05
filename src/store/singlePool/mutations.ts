import { MutationTree } from 'vuex';

export const mutations: MutationTree<SinglePoolState> & SinglePoolMutations = {
  SET_SELECTED_POOL__SINGLE_POOL(state, poolId) {
    state.selectedPool = poolId;
  },
  SET_CREATE_POOL_DIALOG_OPEN__SINGLE_POOL(state, isOpen) {
    state.createPoolDialogOpen = isOpen;
  },
  SET_ADD_REMOVE_POOL_LIQUIDITY_DIALOG__SINGLE_POOL(state, isOpen) {
    state.addRemovePoolLiquidityDialogOpen = isOpen;
  },
  SET_LIQUIDITY_AMOUNT__SINGLE_POOL(state, liquidityAmount) {
    state.liquidityAmount = liquidityAmount;
  },
  SET_LIQUIDITY_PROPERTIES__SINGLE_POOL(state, liquidityProperties) {
    state.liquidityProperties = {
      ...state.liquidityProperties,
      ...liquidityProperties,
    };
  },
  SET_NEW_POOL_PROPERTIES__SINGLE_POOL(state, newPoolProperties) {
    state.newPoolProperties = {
      ...state.newPoolProperties,
      ...newPoolProperties,
    };
  },
};
