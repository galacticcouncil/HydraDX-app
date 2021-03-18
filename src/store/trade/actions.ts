import { Api } from 'hydradx-js';

import { formatBalance } from '@polkadot/util';
import { ActionTree } from 'vuex';
import router from '@/router';

export const actions: ActionTree<TradeState, MergedState> & TradeActions = {
  changeTradeAmountSMTrade({ commit, dispatch }, tradeAmount) {
    commit('SET_TRADE_AMOUNT__TRADE', tradeAmount);
    dispatch('getSellPriceSMTrade');
  },
  changeTradePropertiesSMTrade({ commit, dispatch, state }, tradeProperties) {
    commit('SET_TRADE_PROPERTIES__TRADE', tradeProperties);

    if (
      state.tradeProperties.asset1 != null &&
      state.tradeProperties.asset2 != null
    ) {
      dispatch('getSellPriceSMTrade');
      dispatch('getSpotPriceSMTrade');
    }
  },
  getSpotPriceSMTrade({ state, rootState, commit }) {
    const api = Api.getApi();
    if (state.polling.spot) clearTimeout(state.polling.spot);
    if (api) {
      let asset1: number | null = null;
      let asset2: number | null = null;

      if (router.currentRoute.value.path === '/trade') {
        asset1 = state.tradeProperties.asset1;
        asset2 = state.tradeProperties.asset2;
      } else if (router.currentRoute.value.path === '/liquidity') {
        asset1 = rootState.pool.liquidityProperties.asset1;
        asset2 = rootState.pool.liquidityProperties.asset2;
      } else {
        return;
      }

      const timeout = setTimeout(async () => {
        console.log('asset1 - ', asset1, typeof asset1);
        console.log('asset2 - ', asset2, typeof asset2);

        const amount = await api.hydraDx.query.getSpotPrice(asset1, asset2);
        commit('UPDATE_SPOT_PRICE__TRADE', amount);
      }, 200);
      commit('SET_SPOT_PRICE_TIMER__TRADE', timeout);
    }
  },
  getSellPriceSMTrade({ state, commit }) {
    const api = Api.getApi();
    if (state.polling.real) clearTimeout(state.polling.real);
    if (api) {
      const timeout = setTimeout(async () => {
        const { asset1, asset2, actionType } = state.tradeProperties;
        const tradeAmount = state.tradeAmount;
        console.log('tradeAmount - ', tradeAmount, typeof tradeAmount)
        const amount = await api.hydraDx.query.getTradePrice(
          asset1,
          asset2,
          tradeAmount,
          actionType
        );

        commit('UPDATE_SELL_PRICE__TRADE', amount);
      }, 200);
      commit('SET_SELL_PRICE_TIMER__TRADE', timeout);
    }
  },
  async swapSMTrade({ commit, dispatch, state, rootState }) {
    const api = Api.getApi();
    const account = rootState.wallet.account;
    const amount = state.tradeAmount;
    const asset1 = state.tradeProperties.asset1;
    const asset2 = state.tradeProperties.asset2;
    const actionType = state.tradeProperties.actionType;
    const currentIndex = Math.random();

    if (api && account && amount && asset1 != null && asset2 != null) {
      commit('UPDATE_TRANSACTIONS__TRADE', {
        index: currentIndex,
        accountId: account,
        tokenIn: asset1,
        tokenOut: asset2,
        amountIn: formatBalance(amount),
        expectedOut: state.sellPrice.amountFormatted,
        type: actionType,
        progress: 0,
      });

      api.hydraDx?.tx
        .swapSMTrade(account, asset1, asset2, amount, actionType, currentIndex)
        .then(({ events, status }: { events: any; status: any }) => {
          if (status.isReady) commit('SET_PENDING_ACTION__GENERAL', true);
          dispatch('updateTransactionsSMTrade', {
            events,
            currentIndex,
            status,
          });
          dispatch('getSpotPriceSMTrade');
          dispatch('getSellPriceSMTrade');
        })
        .catch(() => {
          commit('UPDATE_TRANSACTIONS__TRADE', {
            index: currentIndex,
            progress: 5,
          });
        });
    }
  },
  updateTransactionsSMTrade(
    { commit },
    { events, currentIndex, status, instanceOwner }
  ) {
    if (!events) return;
    //TODO: BETTER HANDLING | SPLIT LOGIC

    events.forEach(({ event: { data, method } }) => {
      console.log(`=========== ${instanceOwner} ==========`);
      console.log('---- status', status?.toHuman(), method, currentIndex);

      if (method === 'IntentionRegistered') {
        if (status && status.isInBlock) {
          const parsedData = data.toJSON();
          /**
           * parsedData: <Array> [AccountId, AssetId, AssetId, Balance, IntentionType, IntentionID]
           *                     [who, asset a, asset b, amount, intention type, intention id]
           */
          if (Array.isArray(parsedData) && parsedData.length === 6) {
            const id = parsedData[5]?.toString();
            commit('UPDATE_TRANSACTIONS__TRADE', {
              id: id,
              index: currentIndex,
              progress: 2,
            });
          }
        }
      }
      if (
        method === 'ExtrinsicFailed' &&
        currentIndex != null &&
        status?.isInBlock
      ) {
        commit('UPDATE_TRANSACTIONS__TRADE', {
          id: Math.random(),
          index: currentIndex,
          progress: 4,
        });
      }
      if (method === 'IntentionResolvedAMMTrade') {
        const parsedData = data.toJSON();
        /**
         * parsedData: <Array> [AccountId, IntentionType, IntentionID, Balance, Balance]
         *                     [who, intention type, intention id, amount, amount sold/bought]
         */
        if (Array.isArray(parsedData)) {
          const id = parsedData[2]?.toString();
          commit('UPDATE_TRANSACTIONS__TRADE', {
            id: id,
            progress: 3,
          });
        }
      }
      if (method === 'IntentionResolvedDirectTrade') {
        //TODO: add amounts matched
        const parsedData = data.toJSON();
        /**
         * parsedData: <Array> [AccountId, AccountId, IntentionID, IntentionID, Balance, Balance]
         *                     [User1 accid, User1 accid, intention id 1, intention id 2, amount 1, amount 2]
         */

        if (Array.isArray(parsedData)) {
          commit('UPDATE_TRANSACTIONS__TRADE', {
            id: parsedData[3]?.toString(),
            progress: 3,
          });
          commit('UPDATE_TRANSACTIONS__TRADE', {
            id: parsedData[4]?.toString(),
            progress: 3,
          });
        }
      }
    });
  },
};
