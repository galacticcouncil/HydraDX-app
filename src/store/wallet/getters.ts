import { GetterTree } from 'vuex';

export const getters: GetterTree<WalletState, MergedState> & WalletGetters = {
  account: ({ account }) => account,
  accountInfo: ({ account, accountList }) => {
    return accountList.find(x => x.address === account) || null;
  },
  accountList: ({ accountList }) => accountList,
  assetBalances: ({ assetList, assetBalances }, getters, rootState) => {
    if (!assetList) return [];

    // TODO: Faster algo
    return assetList.map(assetRecord => {
      const tokenInfo = assetBalances.find(
        x => x && x.assetId == assetRecord.assetId
      );
      let name = assetRecord.name;
      const shareToken = rootState.trade.shareTokenIds.includes(
        assetRecord.assetId
      );
      if (shareToken) {
        for (const key in rootState.pool.poolInfo) {
          if (
            Object.prototype.hasOwnProperty.call(rootState.pool.poolInfo, key)
          ) {
            const pool = rootState.pool.poolInfo[key];
            if (pool.shareToken === assetRecord.assetId) {
              name = pool.poolAssets
                .map(asset => assetList.find(x => x && x.assetId == asset))
                .map(x => x?.name)
                .join(' | ');
              break;
            }
          }
        }
      }
      const balance = tokenInfo?.balance;
      const balanceFormatted = tokenInfo?.balanceFormatted;

      return {
        ...assetRecord,
        name,
        shareToken,
        balance: balance || 0,
        balanceFormatted: balanceFormatted || '0',
      };
    });
  },
  assetList: ({ assetList }) => assetList,
};
