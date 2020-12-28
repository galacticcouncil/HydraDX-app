import { Module } from 'vuex';

import { state } from '@/store/pool/state.ts';
import { mutations } from '@/store/pool/mutations.ts';
import { actions } from '@/store/pool/actions.ts';
import { getters } from '@/store/pool/getters.ts';

export const pool: Module<PoolState, MergedState> = {
  // namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
