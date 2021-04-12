import { MutationTree } from 'vuex';

export const mutations: MutationTree<PoolState> & PoolMutations = {
  SET_SELECTED_POOL__POOL(state, poolId) {
    state.selectedPool = poolId;
  },
  SET_CREATE_POOL_DIALOG_OPEN__POOL(state, isOpen) {
    state.createPoolDialogOpen = isOpen;
  },
  SET_LIQUIDITY_AMOUNT__POOL(state, liquidityAmount) {
    state.liquidityAmount = liquidityAmount;
  },
  SET_LIQUIDITY_PROPERTIES__POOL(state, liquidityProperties) {
    state.liquidityProperties = {
      ...state.liquidityProperties,
      ...liquidityProperties,
    };
  },
  SET_NEW_POOL_PROPERTIES__POOL(state, newPoolProperties) {
    state.newPoolProperties = {
      ...state.newPoolProperties,
      ...newPoolProperties,
    };
  },
  SET_POOL_INFO__POOL(state, poolInfo) {
    state.poolInfo = poolInfo;
  },
};
