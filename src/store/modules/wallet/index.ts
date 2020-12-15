import { Module } from 'vuex';
import { WalletStateTypes, IRootState } from '@/store/interfaces';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import { state } from './state';

// Module
const account: Module<WalletStateTypes, IRootState> = {
  state,
  getters,
  mutations,
  actions,
};

export default account;
