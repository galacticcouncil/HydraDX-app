import { ActionTree } from 'vuex';
import { ActionTypes } from './action-types';
import { MutationTypes } from './mutation-types';
import { RootActionsTypes, IRootState } from '@/store/interfaces';

export const actions: ActionTree<IRootState, IRootState> & RootActionsTypes = {
  [ActionTypes.UPDATE_BLOCK_HASH]({ commit }, payload: string | null) {
    commit(MutationTypes.SET_BLOCK_HASH, payload);
  },
  [ActionTypes.UPDATE_BLOCK_NUMBER]({ commit }, payload: number) {
    commit(MutationTypes.SET_BLOCK_NUMBER, payload);
  },
};
