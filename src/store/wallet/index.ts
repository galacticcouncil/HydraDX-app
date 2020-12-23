import { Module } from 'vuex';

import { state } from '@/store/wallet/state.ts';
import { mutations } from '@/store/wallet/mutations.ts';
import { actions } from '@/store/wallet/actions.ts';
import { getters } from '@/store/wallet/getters.ts';

export const wallet: Module<WalletState, MergedState> = {
  // namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
