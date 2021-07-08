import { ActionTree } from 'vuex';
import { Api } from 'hydradx-js';

export const actions: ActionTree<PoolState, MergedState> & PoolActions = {
  async syncPoolsSMPool({ commit }) {
    const api = Api.getApi();
    if (!api) return;

    try {
      const { tokenTradeMap, shareTokenIds, poolInfo } =
        await api.hydraDx.query.getPoolInfo();
      commit('UPDATE_TOKEN_TRADE_MAP__TRADE', tokenTradeMap);
      commit('SET_SHARE_TOKEN_IDS__TRADE', shareTokenIds);
      commit('SET_POOLS_INFO__POOL', poolInfo);
    } catch (e) {
      console.log(e);
    }
  },
};
