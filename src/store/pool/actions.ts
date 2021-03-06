// import { formatBalance } from '@polkadot/util';
// import { EventRecord, ExtrinsicStatus } from '@polkadot/types/interfaces';
// import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { ActionTree } from 'vuex';
import { Api, bnToDec, decToBn } from 'hydradx-js';
import { bnToBn } from "@polkadot/util";

import { getSigner } from '../../utils';

export const actions: ActionTree<PoolState, MergedState> & PoolActions = {
  changeSelectedPoolSMPool({ commit, dispatch }, poolId) {
    dispatch('getSpotPriceSMTrade');
    commit('SET_SELECTED_POOL__POOL', poolId);
  },
  async addLiquiditySMPool({ dispatch, commit, state, rootState }) {
    const api = Api.getApi();
    const account = rootState.wallet.account;
    const amount = state.liquidityAmount;
    const asset1 = state.liquidityProperties.asset1;
    const asset2 = state.liquidityProperties.asset2;
    const spotPrice = rootState.trade.spotPrice.inputAmount;

    const maxSellPrice = decToBn(bnToDec(amount).multipliedBy(spotPrice * 1.1));

    if (api && account) {
      const signer = await getSigner(account);
      api.tx.amm
        .addLiquidity(asset1, asset2, amount, maxSellPrice)
        .signAndSend(account, { signer: signer }, ({ status }) => {
          if (status.isReady) commit('SET_PENDING_ACTION__GENERAL', true);
          dispatch('getSpotPriceSMTrade');
        });
    }
  },
  async withdrawLiquiditySMPool({ dispatch, commit, state, rootState }) {
    const api = Api.getApi();
    const account = rootState.wallet.account;
    const selectedPool = state.selectedPool;
    const asset1 = state.liquidityProperties.asset1;
    const asset2 = state.liquidityProperties.asset2;

    if (api && account && selectedPool) {
      const shareToken = state.poolInfo[selectedPool].shareToken;
      const liquidityBalance = rootState.wallet.assetBalances[shareToken].balance;
      const percentage = state.liquidityAmount;

      const api = Api.getApi();

        if (api && account && selectedPool) {
          const signer = await getSigner(account);
          const liquidityToRemove = liquidityBalance
            .div(bnToBn(100))
            .mul(percentage);
    
          api.tx.amm
            .removeLiquidity(asset1, asset2, liquidityToRemove)
            .signAndSend(account, { signer: signer }, ({ status }) => {
              if (status.isReady) commit('SET_PENDING_ACTION__GENERAL', true);
              dispatch('getSpotPriceSMTrade');
            });
        }
    }
  },
  async syncPoolsSMPool({ commit }) {
    const api = Api.getApi();
    if (!api) return;
    const { tokenTradeMap, shareTokenIds, poolInfo } = await api.hydraDx.query.getPoolInfo();

    commit('UPDATE_TOKEN_TRADE_MAP__TRADE', tokenTradeMap);
    commit('SET_SHARE_TOKEN_IDS__TRADE', shareTokenIds);
    commit('SET_POOL_INFO__POOL', poolInfo);
  },
};
