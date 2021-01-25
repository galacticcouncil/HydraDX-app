import Api from '@/api';

import { bnToBn } from '@polkadot/util';
// import { bnToDec, decToBn } from '@/services/utils';
import { formatBalance } from '@polkadot/util';
// import { EventRecord, ExtrinsicStatus } from '@polkadot/types/interfaces';
// import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
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

      // console.log(
      //   asset1,
      //   state.tradeProperties.asset1,
      //   asset2,
      //   state.tradeProperties.asset2,
      //   state.tradeAmount
      // );

      const timeout = setTimeout(async () => {
        const amountData =
          // @ts-expect-error TS2339
          await api.rpc.amm.getSpotPrice(asset1, asset2, 1000000000000);

        const amount = amountData.amount;
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
        let amount = bnToBn(0);

        console.log(
          state.tradeProperties.asset1,
          state.tradeProperties.asset2,
          state.tradeAmount
        );
        if (state.tradeAmount) {
          if (state.tradeProperties.actionType === 'sell') {
            // @ts-expect-error TS2339
            const amountData = await api.rpc.amm.getSellPrice(
              state.tradeProperties.asset1,
              state.tradeProperties.asset2,
              state.tradeAmount
            );

            amount = amountData.amount;
          } else {
            // @ts-expect-error TS2339
            const amountData = await api.rpc.amm.getBuyPrice(
              state.tradeProperties.asset1,
              state.tradeProperties.asset2,
              state.tradeAmount
            );

            amount = amountData.amount;
          }
        }
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

      const signer = await Api.getSinger(account);
      if (actionType === 'buy') {
        api.tx.exchange
          //TODO: CALCULATE LIMITS FROM SPOT PRICE
          .buy(asset1, asset2, amount, bnToBn('100000000000000000'), false)
          .signAndSend(account, { signer: signer }, ({ events, status }) => {
            if (status.isReady) commit('SET_PENDING_ACTION__GENERAL', true);
            dispatch('updateTransactionsSMTrade', {
              events,
              currentIndex,
              status,
              instanceOwner: 'Transaction callback listener',
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
      } else {
        api.tx.exchange
          //TODO: CALCULATE LIMITS FROM SPOT PRICE
          .sell(asset1, asset2, amount, bnToBn(1000), false)
          .signAndSend(account, { signer: signer }, ({ events, status }) => {
            if (status.isReady) commit('SET_PENDING_ACTION__GENERAL', true);
            dispatch('updateTransactionsSMTrade', {
              events,
              currentIndex,
              status,
              instanceOwner: 'Transaction callback listener',
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
