import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import { ActionTree } from 'vuex';
import { ActionTypes } from '@/store/modules/wallet/action-types';
import { MutationTypes } from '@/store/modules/wallet/mutation-types';
import { AllMutationTypes } from '@/store/mutation-types';
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
    commit(AllMutationTypes.root.SET_EXTENSION_PRESENT, true, { root: true });
    if (!rootState.savedScreen) {
      commit(AllMutationTypes.root.SET_SCREEN, 'wallet', { root: true });
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
