import { GetterTree } from 'vuex';

export const getters: GetterTree<PoolState, MergedState> & PoolGetters = {
  poolInfo: ({ poolInfo }, getters, rootState) => {
    for (const pool in poolInfo) {
      poolInfo[pool].poolAssetNames = [];
      poolInfo[pool].poolAssetNames[0] =
        rootState.wallet.assetList[poolInfo[pool].poolAssets[0]].name;
      poolInfo[pool].poolAssetNames[1] =
        rootState.wallet.assetList[poolInfo[pool].poolAssets[1]].name;
    }
    return poolInfo;
  },
  pendingAction: ({ pendingAction }) => pendingAction,
};
