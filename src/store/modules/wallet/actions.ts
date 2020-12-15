import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import { ActionTree } from 'vuex';
import { ActionTypes } from './action-types';
import { MutationTypes } from './mutation-types';
import {
  WalletActionsTypes,
  WalletStateTypes,
  IRootState,
} from '@/store/interfaces';

export const actions: ActionTree<WalletStateTypes, IRootState> &
  WalletActionsTypes = {
  [ActionTypes.CHANGE_ACCOUNT]({ commit }, account: string | null) {
    commit(MutationTypes.SET_ACCOUNT, account);
    commit(MutationTypes.SET_ASSET_BALANCES, []);
  },
  [ActionTypes.UPDATE_WALLET_INFO](
    { commit, dispatch, state, rootState },
    accountsWithMeta: InjectedAccountWithMeta[]
  ) {
    const accounts = accountsWithMeta.map(account => {
      return {
        address: account.address.toString(),
        name: account.meta.name?.toString(),
      };
    });
    // TODO change for real keys
    commit('setExtensionPresent', true);
    // TODO change for real keys
    if (!rootState.savedScreen) {
      commit('setScreen', 'wallet');
    }
    if (accounts.length) {
      commit(MutationTypes.SET_ACCOUNT_LIST, accounts);
      if (state.account && !accounts.find(x => x.address === state.account)) {
        localStorage.removeItem('account');
        dispatch(ActionTypes.CHANGE_ACCOUNT, null);
      }
    } else {
      localStorage.removeItem('account');
      dispatch(ActionTypes.CHANGE_ACCOUNT, null);
      commit(MutationTypes.SET_ACCOUNT_LIST, []);
    }
  },
};
