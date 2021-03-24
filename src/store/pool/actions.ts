import { ActionTree } from 'vuex';
import { Api } from 'hydradx-js';

import { getSigner } from '@/services/utils';
import BigNumber from 'bignumber.js';

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
    const spotPrice = rootState.trade.spotPrice;

    //TODO update multiply action -> spotPrice * 1.1
    const maxSellPrice = amount.multipliedBy(spotPrice.amount.multipliedBy(1.1));

    if (api && account) {
      const signer = await getSigner(account);

      api.tx.amm
        .addLiquidity(asset1, asset2, amount, maxSellPrice)
        // @ts-ignore
        .signAndSend(account, { signer }, ({ status }) => {
          if (status.isReady) commit('SET_PENDING_ACTION__GENERAL', true);
          dispatch('getSpotPriceSMTrade');
        });
      //TODO Add error handler and notifications
    }
  },
  async withdrawLiquiditySMPool({ dispatch, commit, state, rootState }) {
    const api = Api.getApi();
    const account = rootState.wallet.account;
    const asset1 = state.liquidityProperties.asset1;
    const asset2 = state.liquidityProperties.asset2;
    const selectedPool = state.selectedPool;

    if (api && account && selectedPool) {
      const shareToken = state.poolInfo[selectedPool].shareToken;

      const liquidityBalance =
        rootState.wallet.assetBalances[shareToken].balance;
      const percentage = state.liquidityAmount;

      const api = Api.getApi();

      if (api && account && selectedPool) {
        const signer = await getSigner(account);
        const liquidityToRemove = liquidityBalance
          .div(new BigNumber(100))
          .multipliedBy(percentage);

        api.tx.amm
          .removeLiquidity(asset1, asset2, liquidityToRemove)
          // @ts-ignore
          .signAndSend(account, { signer }, ({ status }) => {
            if (status.isReady) commit('SET_PENDING_ACTION__GENERAL', true);
            dispatch('getSpotPriceSMTrade');
          });
      }
    }
  },
  async syncPoolsSMPool({ commit }) {
    const api = Api.getApi();
    if (!api) return;

    const {
      tokenTradeMap,
      shareTokenIds,
      poolInfo,
    } = await api.hydraDx.query.getPoolInfo();

    commit('UPDATE_TOKEN_TRADE_MAP__TRADE', tokenTradeMap);
    commit('SET_SHARE_TOKEN_IDS__TRADE', shareTokenIds);
    commit('SET_POOL_INFO__POOL', poolInfo);
  },
};
