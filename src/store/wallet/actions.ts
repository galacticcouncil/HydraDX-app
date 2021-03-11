import { Api } from 'hydradx-js';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { ActionTree } from 'vuex';
import { getSigner } from '@/services/utils';

export const actions: ActionTree<WalletState, MergedState> & WalletActions = {
  changeAccountSMWallet({ commit }, account: string | null) {
    commit('SET_ACCOUNT__WALLET', account);
    commit('SET_ASSET_BALANCES__WALLET', []);
  },

  updateWalletInfoSMWallet(
    { commit, dispatch, state },
    accountsWithMeta: InjectedAccountWithMeta[]
  ) {
    const accounts = accountsWithMeta.map(account => {
      return {
        address: account.address.toString() || '',
        name: account.meta.name?.toString() || '',
      };
    });
    commit('SET_EXTENSION_PRESENT__GENERAL', true);

    if (accounts.length) {
      commit('SET_ACCOUNT_LIST__WALLET', accounts);
      if (state.account && !accounts.find(x => x.address === state.account)) {
        localStorage.removeItem('account');
        dispatch('changeAccountSMWallet', null);
      } else if (!state.account) {
        //TODO add handler
        console.log(state.account);
      }
    } else {
      localStorage.removeItem('account');
      dispatch('changeAccountSMWallet', null);
      commit('SET_ACCOUNT_LIST__WALLET', []);
    }
    // router.push('/wallet');
  },
  async syncAssetBalancesSMWallet(context) {
    const api = Api.getApi();
    const balances = await api.hydraDx.query.getAccountBalances(
      context.state.account
    );
    context.commit('SET_ASSET_BALANCES__WALLET', balances);
  },
  async syncAssetListSMWallet(context) {
    const api = Api.getApi();
    const assetList = await api.hydraDx.query.getAssetList();
    context.commit('SET_ASSET_LIST__WALLET', assetList);
  },
  async mintAssetSMWallet({ commit, rootState }, assetId) {
    const account = rootState.wallet.account || '';
    const api = Api.getApi();
    const signer = await getSigner(account);
    api.tx.faucet
      .mint(assetId, 100000000000000)
      .signAndSend(account, { signer }, ({ events, status }) => {
        if (status.isReady) commit('SET_PENDING_ACTION__GENERAL', true);
      });
  },
};
