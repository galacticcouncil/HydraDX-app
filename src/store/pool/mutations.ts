import { MutationTree } from 'vuex';

export const mutations: MutationTree<PoolState> & PoolMutations = {
  SET_POOLS_INFO__POOL(state, poolsInfo) {
    state.poolsInfo = poolsInfo;
  },
};
