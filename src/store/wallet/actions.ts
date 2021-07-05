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
    { commit, dispatch, state, rootState },
    accountsWithMeta: InjectedAccountWithMeta[]
  ) {
    const accounts = accountsWithMeta
      /**
       * Filter available Polkadot extension accounts by genesis hash to show
       * only correct HydraDX accounts.
       */
      .filter(acc => {
        return (
          acc.meta.genesisHash &&
          (rootState.general.genesisHash === acc.meta.genesisHash ||
            rootState.general.allowedGenesisHashes.includes(
              acc.meta.genesisHash
            ))
        );
      })
      .map(account => {
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
    try {
      const balances = await api.hydraDx.query.getAccountBalances(
        context.state.account
      );

      context.commit('SET_ASSET_BALANCES__WALLET', balances);
    } catch (e) {
      console.log(e);
    }
  },
  async syncAssetListSMWallet({ commit }) {
    const api = Api.getApi();
    try {
      const assetList = await api.hydraDx.query.getAssetList();
      commit('SET_ASSET_LIST__WALLET', assetList);
    } catch (e) {
      console.log(e);
    }
  },
  async mintAssetSMWallet({ commit, rootState }) {
    const account = rootState.wallet.account || '';
    const api = Api.getApi();
    const signer = await getSigner(account);

    try {
      commit('SET_PENDING_ACTION__GENERAL', true);
      const mintResp = await api.hydraDx.tx.mintAsset(account, signer);
      console.log('mintResp - ', mintResp);
    } catch (e) {
      console.log('mintAssetSMWallet - ', e);
    }
    commit('SET_PENDING_ACTION__GENERAL', false);

    // api.tx.faucet
    //   .mint()
    //   // @ts-ignore
    //   .signAndSend(account, { signer }, ({ events, status }) => {
    //     if (status.isReady) commit('SET_PENDING_ACTION__GENERAL', true);
    //   });
  },
};
