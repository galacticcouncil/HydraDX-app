import Api from '@/api';

import { bnToBn } from '@polkadot/util';
// import { bnToDec, decToBn } from '@/services/utils';
import { formatBalance } from '@polkadot/util';
// import { EventRecord, ExtrinsicStatus } from '@polkadot/types/interfaces';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { ActionTree } from 'vuex';
import router from '@/router';

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
      } else if (!state.account) {
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
    const account = context.state.account;
    const balances: AssetBalance[] = [];

    if (account && api) {
      const multiTokenInfo = await api.query.tokens.accounts.entries(account);
      const baseTokenInfo = await api.query.system.account(account);
      const baseTokenBalance = bnToBn(baseTokenInfo.data.free);

      balances[0] = {
        assetId: 0,
        balance: baseTokenBalance,
        balanceFormatted: formatBalance(baseTokenBalance),
      };
      multiTokenInfo.forEach(record => {
        let assetId = 99999;

        const assetInfo = record[0].toHuman();
        if (Array.isArray(assetInfo) && typeof assetInfo[1] === 'string') {
          assetId = parseInt(assetInfo[1]);
        }

        const assetBalances = api.createType('AccountData', record[1]);
        const balance = bnToBn(assetBalances.free);
        const balanceFormatted = formatBalance(balance);

        balances[assetId] = {
          assetId,
          balance,
          balanceFormatted,
        };
      });
    }

    context.commit('SET_ASSET_BALANCES__WALLET', balances);
  },
  async syncAssetListSMWallet(context) {
    const api = Api.getApi();
    if (!api) return;
    const assetIds = await api.query.assetRegistry.assetIds.entries();
    const assetList: AssetRecord[] = [{ assetId: 0, name: 'HDX' }];

    // TODO: Better way to parse mapped records
    assetIds.forEach(([assetName, id]) => {
      const assetId = parseInt(api.createType('Option<u32>', id).toString());
      const name = assetName.toHuman()?.toString() || '0xERR';

      assetList[assetId] = { assetId, name };
    });

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
