import { MutationTree } from 'vuex';
import { MutationTypes } from './mutation-types';
import { WalletMutationsTypes, WalletStateTypes } from '@/store/interfaces';

export const mutations: MutationTree<WalletStateTypes> &
  WalletMutationsTypes = {
  [MutationTypes.SET_ACCOUNT](state: WalletStateTypes, account: string | null) {
    state.account = account;
    localStorage.setItem('account', account || '');
  },
  [MutationTypes.SET_ACCOUNT_LIST](
    state: WalletStateTypes,
    accountList: WalletStateTypes['accountList']
  ) {
    state.accountList = accountList;
  },
  [MutationTypes.SET_ASSET_BALANCES](
    state: WalletStateTypes,
    assetBalances: WalletStateTypes['assetBalances']
  ) {
    state.assetBalances = assetBalances;
  },
};
