import { GetterTree } from 'vuex';

export const getters: GetterTree<PoolState, MergedState> & PoolGetters = {
  poolsInfoSMPool: ({ poolsInfo }, getters, rootState) => {
    for (const pool in poolsInfo) {
      poolsInfo[pool].poolAssetNames = [];
      poolsInfo[pool].poolAssetNames[0] =
        rootState.wallet.assetList[+poolsInfo[pool].poolAssets[0]].name;
      poolsInfo[pool].poolAssetNames[1] =
        rootState.wallet.assetList[+poolsInfo[pool].poolAssets[1]].name;
    }
    return poolsInfo;
  },
};
