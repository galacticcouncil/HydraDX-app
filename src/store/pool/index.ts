import { Module } from 'vuex';

import { state } from '@/store/pool/state';
import { mutations } from '@/store/pool/mutations';
import { actions } from '@/store/pool/actions';
import { getters } from '@/store/pool/getters';

export const pool: Module<PoolState, MergedState> = {
  state,
  mutations,
  actions,
  getters,
};
