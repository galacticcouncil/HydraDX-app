import { Module } from 'vuex';
import { WalletStateTypes, IRootState } from '@/store/interfaces';
import { getters } from '@/store/modules/wallet/getters';
import { actions } from '@/store/modules/wallet/actions';
import { mutations } from '@/store/modules/wallet/mutations';
import { state } from '@/store/modules/wallet/state';

// Module
const wallet: Module<WalletStateTypes, IRootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default wallet;
