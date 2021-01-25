import { bnToBn } from '@polkadot/util';
// import { bnToDec, decToBn } from '@/services/utils';
import { formatBalance } from '@polkadot/util';
// import { EventRecord, ExtrinsicStatus } from '@polkadot/types/interfaces';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { ActionTree } from 'vuex';
import router from '@/router';

import { Api } from '../../hydradxjs';

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

    if (accounts.length) {
      commit('SET_ACCOUNT_LIST__WALLET', accounts);
      if (state.account && !accounts.find(x => x.address === state.account)) {
        localStorage.removeItem('account');
        dispatch('changeAccountSMWallet', null);
        router.push('/wallet');
      } else if (!state.account) {
        router.push('/wallet');
      }
    } else {
      localStorage.removeItem('account');
      dispatch('changeAccountSMWallet', null);
      commit('SET_ACCOUNT_LIST__WALLET', []);
      router.push('/wallet');
    }
  },
  async syncAssetBalancesSMWallet(context) {
    const api = Api.getApi();
    const balances = await api.hydraDx?.syncAssetBalancesSMWallet(context.state.account);
    context.commit('SET_ASSET_BALANCES__WALLET', balances);
  },
  async syncAssetListSMWallet(context) {
    const api = Api.getApi();
    const assetList = await api.hydraDx?.syncAssetListSMWallet();
    context.commit('SET_ASSET_LIST__WALLET', assetList);
  },
  async mintAssetSMWallet({ commit, rootState }, assetId) {
    const api = Api.getApi();
    api.hydraDx?.mintAssetSMWallet(rootState.wallet.account, assetId).then(() => {
      commit('SET_PENDING_ACTION__GENERAL', true);
    });
  },
};
