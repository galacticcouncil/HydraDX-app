import { Api } from 'hydradx-js';
import BigNumber from 'bignumber.js';
import { bnToBn } from '@polkadot/util';

import { ActionTree } from 'vuex';
import router from '@/router';
import {
  getSigner,
  getTransactionFeeInitial,
  getMinReceivedTradeAmount,
  getMaxReceivedTradeAmount,
} from '@/services/utils';

import { handleTradeTransactionError } from '@/services/errorsUtils';

export const actions: ActionTree<TradeState, MergedState> & TradeActions = {
  changeTradeAmountSMTrade({ commit, dispatch }, tradeAmount) {
    commit('SET_TRADE_AMOUNT__TRADE', tradeAmount);
    dispatch('getSellPriceSMTrade');
  },
  changeTradePropertiesSMTrade({ commit, dispatch, state }, tradeProperties) {
    commit('SET_TRADE_PROPERTIES__TRADE', tradeProperties);

    if (
      state.tradeProperties.asset1 !== null &&
      state.tradeProperties.asset2 !== null
    ) {
      dispatch('getSellPriceSMTrade');
      dispatch('getSpotPriceSMTrade');
    }
  },
  async getSpotPriceSMTrade({ state, rootState, commit }) {
    const api = Api.getApi();
    // if (state.polling.spot) clearTimeout(state.polling.spot);

    if (api) {
      let asset1: string | null = null;
      let asset2: string | null = null;

      if (router.currentRoute.value.path.indexOf('/trade') === 0) {
        asset1 = state.tradeProperties.asset1;
        asset2 = state.tradeProperties.asset2;
      } else if (router.currentRoute.value.path.indexOf('/liquidity') === 0) {
        asset1 = rootState.pool.liquidityProperties.asset1;
        asset2 = rootState.pool.liquidityProperties.asset2;
      } else {
        return;
      }

      asset1 = asset1 !== null ? asset1.toString() : null;
      asset2 = asset2 !== null ? asset2.toString() : null;

      try {
        const amount = await api.hydraDx.query.getSpotPrice(asset1, asset2);
        commit('UPDATE_SPOT_PRICE__TRADE', amount);
      } catch (e) {
        console.log(e);
      }

      // //TODO remove timeout
      // const timeout = setTimeout(async () => {
      //   const amount = await api.hydraDx.query.getSpotPrice(asset1, asset2);
      //   commit('UPDATE_SPOT_PRICE__TRADE', amount);
      // }, 200);
      // commit('SET_SPOT_PRICE_TIMER__TRADE', timeout);
    }
  },
  async getSellPriceSMTrade({ state, commit }) {
    const api = Api.getApi();
    // if (state.polling.real) clearTimeout(state.polling.real);
    if (api) {
      try {
        const { asset1, asset2, actionType } = state.tradeProperties;
        const tradeAmount = state.tradeAmount as BigNumber;

        let asset1Local = asset1 !== null ? asset1.toString() : null;
        let asset2local = asset2 !== null ? asset2.toString() : null;

        if (actionType === 'buy') {
          asset1Local = asset2 !== null ? asset2.toString() : null;
          asset2local = asset1 !== null ? asset1.toString() : null;
        }

        const amount = await api.hydraDx.query.getTradePrice(
          asset1Local,
          asset2local,
          tradeAmount,
          actionType
        );

        commit('UPDATE_SELL_PRICE__TRADE', amount);
      } catch (e) {
        console.log(e);
      }
    }
  },
  async swapSMTrade({ commit, dispatch, state, rootState }) {
    const api = Api.getApi();
    const account = rootState.wallet.account;
    const amount = state.tradeAmount;
    const actionType = state.tradeProperties.actionType;
    const slippagePercentage = state.tradeSlippagePercentage;

    const asset1 = state.tradeProperties.asset1;
    const asset2 = state.tradeProperties.asset2;

    if (api && account && amount && asset1 != null && asset2 != null) {
      const signer = await getSigner(account);
      const slippageAmount =
        actionType === 'buy'
          ? getMaxReceivedTradeAmount(
              state.sellPrice.amount,
              slippagePercentage
            )
          : getMinReceivedTradeAmount(
              state.sellPrice.amount,
              slippagePercentage
            );

      const amountBn = amount;
      const totalAmountInitial = state.sellPrice.amount;

      try {
        commit('SET_PENDING_ACTION__GENERAL', true);

        console.log('swap request data - ', {
          asset1Id: asset1,
          asset2Id: asset2,
          amount: amountBn.toString(),
          amountBN: bnToBn(amountBn.toString()).toString(),
          actionType: actionType,
          account: account,
          signer: signer,
          slippage: slippageAmount
            .multipliedBy('1e12')
            .integerValue()
            .toString(),
          slippageBN: bnToBn(
            slippageAmount.multipliedBy('1e12').integerValue().toString()
          ).toString(),
        });

        const swapResp = await api.hydraDx.tx.swap({
          asset1Id: asset1,
          asset2Id: asset2,
          amount: amountBn,
          actionType: actionType,
          account: account,
          signer: signer,
          slippage: slippageAmount,
        });

        if (swapResp && swapResp.data) {
          swapResp.data.slippagePercentage = slippagePercentage;
          swapResp.data.slippageAmount = slippageAmount;
          swapResp.data.totalAmountInitial = totalAmountInitial;
          swapResp.data.saved = new BigNumber(0);
        }

        if (
          swapResp &&
          swapResp.data &&
          swapResp.data.totalAmountFinal !== undefined &&
          swapResp.data.errorDetails === undefined
        ) {
          if (swapResp.data.intentionType === 'BUY') {
            swapResp.data.saved = slippageAmount.minus(
              swapResp.data.totalAmountFinal
            );
            swapResp.data.saved = swapResp.data.saved.plus(
              getTransactionFeeInitial(totalAmountInitial)
            );
          } else {
            swapResp.data.saved =
              swapResp.data.totalAmountFinal.minus(slippageAmount);

            swapResp.data.saved = swapResp.data.saved.minus(
              getTransactionFeeInitial(totalAmountInitial)
            );
          }
        }

        console.log('swapResp - ', swapResp);

        commit('UPDATE_TRANSACTIONS__TRADE', swapResp); //TODO reimplement action implementation

        dispatch('getSpotPriceSMTrade');
        dispatch('getSellPriceSMTrade');
      } catch (error) {
        console.log(error);
        handleTradeTransactionError(error);
      }
      commit('SET_PENDING_ACTION__GENERAL', false);
    }
  },
  updateTransactionsSMTrade({ commit }, transactionData) {
    const { events, currentIndex, status, instanceOwner } = transactionData;

    console.log('--------------------------------------');
    console.log('--------------------------------------');
    console.log('--------------------------------------');
    console.log('transactionData - ', transactionData);

    if (!events) return;
    //TODO: BETTER HANDLING | SPLIT LOGIC

    events.forEach(eventRecord => {
      console.log('eventRecord - ', eventRecord);
      if (!eventRecord.event) {
        return;
      }

      const { data, method } = eventRecord.event;

      console.log(`=========== ${instanceOwner} ==========`);
      console.log('---- status', status?.toHuman(), method, currentIndex);

      if (method === 'IntentionRegistered' && status && status.isInBlock) {
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
