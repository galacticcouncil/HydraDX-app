import { Module } from 'vuex';

import { state } from '@/store/singlePool/state';
import { mutations } from '@/store/singlePool/mutations';
import { actions } from '@/store/singlePool/actions';
import { getters } from '@/store/singlePool/getters';

export const singlePool: Module<SinglePoolState, MergedState> = {
  state,
  mutations,
  actions,
  getters,
};
