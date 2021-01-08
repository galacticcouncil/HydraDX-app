import { Module } from 'vuex';

import { state } from '@/store/general/state.ts';
import { mutations } from '@/store/general/mutations.ts';
import { actions } from '@/store/general/actions.ts';
import { getters } from '@/store/general/getters.ts';

export const general: Module<GeneralState, MergedState> = {
  state,
  mutations,
  actions,
  getters,
};
