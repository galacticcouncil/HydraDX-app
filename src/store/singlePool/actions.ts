import { ActionTree } from 'vuex';
import { Api } from 'hydradx-js';

import { getSigner } from '@/services/utils';
import BigNumber from 'bignumber.js';

export const actions: ActionTree<SinglePoolState, MergedState> &
  SinglePoolActions = {
  changeSelectedPoolSMSinglePool({ commit, dispatch }, poolId) {
    dispatch('getSpotPriceSMTrade');
    commit('SET_SELECTED_POOL__SINGLE_POOL', poolId);
  },
  changeLiquidityAmountSMSinglePool({ commit, dispatch }, liquidityAmount) {
    commit('SET_LIQUIDITY_AMOUNT__SINGLE_POOL', liquidityAmount);
    dispatch('getSellPriceSMTrade');
  },
  changeNewPoolPropertiesSMSinglePool({ commit }, newPoolProperties) {
    commit('SET_NEW_POOL_PROPERTIES__SINGLE_POOL', newPoolProperties);
  },
  async addLiquiditySMSinglePool({ dispatch, commit, state, rootState }) {
    const api = Api.getApi();
    const account = rootState.wallet.account;
    const amount = state.liquidityAmount;
    const asset1 = state.liquidityProperties.asset1;
    const asset2 = state.liquidityProperties.asset2;
    const spotPrice = rootState.trade.spotPrice;

    //TODO update multiply action -> spotPrice * 1.1
    const maxSellPrice = amount.multipliedBy(
      spotPrice.amount.multipliedBy(1.05)
    );

    if (api && account && asset1 !== null && asset2 !== null) {
      const signer = await getSigner(account);

      try {
        commit('SET_PENDING_ACTION__GENERAL', true);
        await api.hydraDx.tx.addLiquidity(
          asset1,
          asset2,
          amount,
          maxSellPrice,
          account,
          signer
        );

        dispatch('getSpotPriceSMTrade');
      } catch (e) {
        console.log(e);
      }
      commit('SET_PENDING_ACTION__GENERAL', false);

      // api.hydraDx.tx
      //   .addLiquidity(asset1, asset2, amount.multipliedBy('1e12'), maxSellPrice)
      //   // @ts-ignore
      //   .signAndSend(account, { signer }, ({ status }) => {
      //     if (status.isReady) commit('SET_PENDING_ACTION__GENERAL', true);
      //     dispatch('getSpotPriceSMTrade');
      //   });
      //TODO Add error handler and notifications
    }
  },
  async withdrawLiquiditySMSinglePool({ dispatch, commit, state, rootState }) {
    const api = Api.getApi();
    const account = rootState.wallet.account;
    const asset1 = state.liquidityProperties.asset1;
    const asset2 = state.liquidityProperties.asset2;
    const selectedPool = state.selectedPool;

    if (api && account && selectedPool && asset1 !== null && asset2 !== null) {
      const shareToken = rootState.pool.poolsInfo[selectedPool].shareToken;

      const liquidityBalance =
        rootState.wallet.assetBalances[shareToken].balance;

      const percentage = state.liquidityAmount;

      const signer = await getSigner(account);
      BigNumber.config({ ROUNDING_MODE: 0 });
      const liquidityToRemove = liquidityBalance
        .div(new BigNumber(100))
        .multipliedBy(percentage); // TODO remove after SDK update

      try {
        commit('SET_PENDING_ACTION__GENERAL', true);
        await api.hydraDx.tx.removeLiquidity(
          asset1,
          asset2,
          liquidityToRemove.integerValue(),
          account,
          signer
        );

        dispatch('getSpotPriceSMTrade');
      } catch (e) {
        console.log(e);
      }
      commit('SET_PENDING_ACTION__GENERAL', false);

      // api.hydraDx.tx
      //   .removeLiquidity(asset1, asset2, liquidityToRemove.integerValue())
      //   // @ts-ignore
      //   .signAndSend(account, { signer }, ({ status }) => {
      //     if (status.isReady) commit('SET_PENDING_ACTION__GENERAL', true);
      //     dispatch('getSpotPriceSMTrade');
      //   });
    }
  },

  async createPoolSMSinglePool({ commit, state, rootState }) {
    const api = Api.getApi();

    const account = rootState.wallet.account;
    const { asset1, asset2, initialPrice, amount } = state.newPoolProperties;

    if (api && account && asset1 !== null && asset2 !== null) {
      const signer = await getSigner(account);

      try {
        commit('SET_PENDING_ACTION__GENERAL', true);
        const resp = await api.hydraDx.tx.createPool(
          asset1,
          asset2,
          amount,
          initialPrice, // has 1e18 format on API side
          account,
          signer
        );
        // TODO Check response data and show nontifictation
        console.log('resp - ', resp);
      } catch (e) {
        console.log(e);
      }
      commit('SET_PENDING_ACTION__GENERAL', false);
    }
  },
};
