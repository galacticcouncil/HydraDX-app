import { MutationTree } from 'vuex';

export const mutations: MutationTree<WalletState> & WalletMutations = {
  SET_ACCOUNT__WALLET(state, account) {
    state.account = account;
    localStorage.setItem('account', account || '');
  },
  SET_ACCOUNT_LIST__WALLET(state, accountList) {
    state.accountList = accountList;
  },
  SET_ASSET_BALANCES__WALLET(state, assetBalances) {
    state.assetBalances = assetBalances;
  },
  SET_ASSET_LIST__WALLET(state, assetList) {
    state.assetList = assetList;
  },
};
