import Api from '@/api';

import { bnToBn } from '@polkadot/util';
// import { bnToDec, decToBn } from '@/services/utils';
import { formatBalance } from '@polkadot/util';
// import { EventRecord, ExtrinsicStatus } from '@polkadot/types/interfaces';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { ActionTree } from 'vuex';
import router from '@/router';

import { syncAssetBalancesSMWallet, syncAssetListSMWallet } from '../../hydradxjs';

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
    const balances = await syncAssetBalancesSMWallet(context.state.account);
    context.commit('SET_ASSET_BALANCES__WALLET', balances);
  },
  async syncAssetListSMWallet(context) {
    const assetList = await syncAssetListSMWallet();
    context.commit('SET_ASSET_LIST__WALLET', assetList);
  },
  async mintAssetSMWallet({ commit, rootState }, assetId) {
    const api = Api.getApi();
    const account = rootState.wallet.account;
    if (api && account) {
      const signer = await Api.getSinger(account);
      api.tx.faucet
        .mint(assetId, 100000000000000)
        .signAndSend(account, { signer: signer }, ({ events, status }) => {
          if (status.isReady) commit('SET_PENDING_ACTION__GENERAL', true);
          // TODO:STUFF
        });
    }
  },
};
