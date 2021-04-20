import { ActionTree } from 'vuex';
import { Api } from 'hydradx-js';

import { getSigner } from '@/services/utils';
import BigNumber from 'bignumber.js';
import { bnToBn } from '@polkadot/util';

export const actions: ActionTree<PoolState, MergedState> & PoolActions = {
  changeSelectedPoolSMPool({ commit, dispatch }, poolId) {
    dispatch('getSpotPriceSMTrade');
    commit('SET_SELECTED_POOL__POOL', poolId);
  },
  changeLiquidityAmountSMPool({ commit, dispatch }, liquidityAmount) {
    commit('SET_LIQUIDITY_AMOUNT__POOL', liquidityAmount);
    dispatch('getSellPriceSMTrade');
  },
  changeNewPoolPropertiesSMPool(
    { commit, dispatch, state },
    newPoolProperties
  ) {
    commit('SET_NEW_POOL_PROPERTIES__POOL', newPoolProperties);
  },
  async addLiquiditySMPool({ dispatch, commit, state, rootState }) {
    const api = Api.getApi();
    const account = rootState.wallet.account;
    const amount = state.liquidityAmount;
    const asset1 = state.liquidityProperties.asset1;
    const asset2 = state.liquidityProperties.asset2;
    const spotPrice = rootState.trade.spotPrice;

    //TODO update multiply action -> spotPrice * 1.1
    const maxSellPrice = amount
      .multipliedBy(spotPrice.amount.multipliedBy(1.05))
      .multipliedBy('1e12');

    if (api && account && asset1 !== null && asset2 !== null) {
      const signer = await getSigner(account);

      api.hydraDx.tx
        .addLiquidity(
          asset1,
          asset2,
          amount.multipliedBy('1e12'),
          maxSellPrice
        )
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

    if (api && account && selectedPool && asset1 !== null && asset2 !== null) {
      const shareToken = state.poolInfo[selectedPool].shareToken;

      const liquidityBalance =
        rootState.wallet.assetBalances[shareToken].balance;

      const percentage = state.liquidityAmount;

      const signer = await getSigner(account);
      BigNumber.config({ ROUNDING_MODE: 0 });
      const liquidityToRemove = liquidityBalance
        .div(new BigNumber(100))
        .multipliedBy(percentage); // TODO remove after SDK update

      api.hydraDx.tx
        .removeLiquidity(
          asset1,
          asset2,
          liquidityToRemove.integerValue()
        )
        // @ts-ignore
        .signAndSend(account, { signer }, ({ status }) => {
          if (status.isReady) commit('SET_PENDING_ACTION__GENERAL', true);
          dispatch('getSpotPriceSMTrade');
        });
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

  async createPoolSMPool({ commit, state, rootState }) {
    const api = Api.getApi();

    const account = rootState.wallet.account;
    const { asset1, asset2, initialPrice, amount } = state.newPoolProperties;

    if (api && account && asset1 !== null && asset2 !== null) {
      const signer = await getSigner(account);

      console.log('asset1 - ', asset1)
      console.log('asset2 - ', asset2)
      console.log('amount - ', amount.multipliedBy('1e12').toString())
      console.log('initialPrice - ', initialPrice.multipliedBy('1e18').toString())

      const resp = await api.hydraDx.tx
        .createPool(
          asset1,
          asset2,
          amount.multipliedBy('1e12'),
          initialPrice.multipliedBy('1e18')
        )
        // @ts-ignore
        .signAndSend(account, { signer }, ({ status }) => {
          if (status.isReady) commit('SET_PENDING_ACTION__GENERAL', true);
        });

      console.log('resp - ', resp);
    }
  },
};
