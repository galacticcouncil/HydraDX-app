import { ActionTree } from 'vuex';

export const actions: ActionTree<GeneralState, MergedState> & GeneralActions = {
  updateBlockHashSMGeneral({ commit }, payload: string | null) {
    commit('SET_BLOCK_HASH__GENERAL', payload);
  },
  updateBlockNumberSMGeneral({ commit }, payload: number) {
    commit('SET_BLOCK_NUMBER__GENERAL', payload);
  },
};
