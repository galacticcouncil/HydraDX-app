import Api from '@/api';

import { bnToBn } from '@polkadot/util';
import { bnToDec, decToBn } from '@/services/utils';
// import { formatBalance } from '@polkadot/util';
// import { EventRecord, ExtrinsicStatus } from '@polkadot/types/interfaces';
// import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { ActionTree } from 'vuex';

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
      const signer = await Api.getSinger(account);
      api.tx.amm
        .addLiquidity(asset1, asset2, amount, maxSellPrice)
        .signAndSend(account, { signer: signer }, ({ status }) => {
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

    if (api && account && state.selectedPool) {
      const signer = await Api.getSinger(account);
      const percentage = state.liquidityAmount;
      const shareToken = state.poolInfo[state.selectedPool].shareToken;
      const liquidityBalance =
        rootState.wallet.assetBalances[shareToken].balance;
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
  },
  async syncPoolsSMPool({ commit }) {
    const api = Api.getApi();
    if (!api) return;
    const allPools = await api.query.amm.poolAssets.entries();
    const allTokens = await api.query.amm.shareToken.entries();

    const poolInfo: PoolInfo = {};

    const shareTokenIds: number[] = [];
    const tokenTradeMap: TokenTradeMap = {};

    allPools.forEach(([key, value]) => {
      const poolId = key.toHuman()?.toString() || 'ERR';
      const poolAssets = api
        .createType('Vec<u32>', value)
        .map(assetId => assetId.toNumber())
        .sort((a, b) => a - b);

      poolAssets.forEach((asset, key) => {
        const otherAsset = poolAssets[+!key];

        if (!tokenTradeMap[asset]) tokenTradeMap[asset] = [];
        if (tokenTradeMap[asset].indexOf(otherAsset) === -1) {
          tokenTradeMap[asset].push(otherAsset);
        }
      });

      poolInfo[poolId] = {
        poolAssets,
        shareToken: 99999,
        poolAssetNames: [],
      };
    });

    allTokens.forEach(([key, value]) => {
      const poolId = key.toHuman()?.toString() || 'ERR';
      const shareToken = api.createType('u32', value).toNumber();

      shareTokenIds.push(shareToken);

      poolInfo[poolId].shareToken = shareToken;
    });

    commit('UPDATE_TOKEN_TRADE_MAP__TRADE', tokenTradeMap);
    commit('SET_SHARE_TOKEN_IDS__TRADE', shareTokenIds);
    commit('SET_POOL_INFO__POOL', poolInfo);
  },
};
