import { Module } from 'vuex';

import { state } from '@/store/general/state';
import { mutations } from '@/store/general/mutations';
import { actions } from '@/store/general/actions';
import { getters } from '@/store/general/getters';

export const general: Module<GeneralState, MergedState> = {
  state,
  mutations,
  actions,
  getters,
};
