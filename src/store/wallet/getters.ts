import { GetterTree } from 'vuex';

export const getters: GetterTree<WalletState, MergedState> & WalletGetters = {
  account: ({ account }) => account,
  accountInfo: ({ account, accountList }) => {
    return accountList.find(x => x.address === account) || null;
  },
  accountList: ({ accountList }) => accountList,
  assetBalances: ({ assetList, assetBalances, shareTokenIds, poolInfo }) => {
    if (!assetList) return [];

    // TODO: Faster algo
    const balances = assetList.map(assetRecord => {
      const tokenInfo = assetBalances.find(
        x => x && x.assetId == assetRecord.assetId
      );
      let name = assetRecord.name;
      const shareToken = shareTokenIds.includes(assetRecord.assetId);
      if (shareToken) {
        for (const key in poolInfo) {
          const pool = poolInfo[key];
          if (pool.shareToken === assetRecord.assetId) {
            name = pool.poolAssets
              .map(asset => assetList.find(x => x && x.assetId == asset))
              .map(x => x?.name)
              .join(' | ');
            break;
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
        balanceFormatted: balanceFormatted || 0,
      };
    });
    return balances;
  },
  assetList: ({ assetList }) => assetList,
};
