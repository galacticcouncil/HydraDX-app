import { Module } from 'vuex';

import { state } from '@/store/wallet/state';
import { mutations } from '@/store/wallet/mutations';
import { actions } from '@/store/wallet/actions';
import { getters } from '@/store/wallet/getters';

export const wallet: Module<WalletState, MergedState> = {
  state,
  mutations,
  actions,
  getters,
};
