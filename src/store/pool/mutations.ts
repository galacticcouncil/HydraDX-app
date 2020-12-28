import { MutationTree } from 'vuex';

export const mutations: MutationTree<PoolState> & PoolMutations = {
  SET_PENDING_ACTION__POOL(state, pending) {
    state.pendingAction = pending;
  },
  SET_SELECTED_POOL__POOL(state, poolId) {
    state.selectedPool = poolId;
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
  SET_POOL_INFO__POOL(state, poolInfo) {
    state.poolInfo = poolInfo;
  },

};
