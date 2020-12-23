import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import { ActionTree } from 'vuex';

export const actions: ActionTree<WalletState, MergedState> & WalletActions = {
  changeAccountSMWallet({ commit }, account: string | null) {
    commit('SET_ACCOUNT__WALLET', account);
    commit('SET_ASSET_BALANCES__WALLET', []);
  },

  updateWalletInfoSMWallet(
    { commit, dispatch, state, rootState },
    accountsWithMeta: InjectedAccountWithMeta[]
  ) {
    const accounts = accountsWithMeta.map(account => {
      return {
        address: account.address.toString() || '',
        name: account.meta.name?.toString() || '',
      };
    });
    commit('SET_EXTENSION_PRESENT__GENERAL', true);
    if (!rootState.savedScreen) {
      commit('SET_SCREEN__GENERAL', 'wallet');
    }
    if (accounts.length) {
      commit('SET_ACCOUNT_LIST__WALLET', accounts);
      if (state.account && !accounts.find(x => x.address === state.account)) {
        localStorage.removeItem('account');
        dispatch('changeAccountSMWallet', null);
      }
    } else {
      localStorage.removeItem('account');
      dispatch('changeAccountSMWallet', null);
      commit('SET_ACCOUNT_LIST__WALLET', []);
    }
  },
};
