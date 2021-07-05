import { GetterTree } from 'vuex';
import BigNumber from 'bignumber.js';

export const getters: GetterTree<WalletState, MergedState> & WalletGetters = {
  accountSMWallet: ({ account }) => account,
  accountInfoSMWallet: ({ account, accountList }) => {
    return accountList.find(x => x.address === account) || null;
  },
  accountListSMWallet: ({ accountList }) => accountList,
  assetBalancesSMWallet: ({ assetList, assetBalances }, getters, rootState) => {
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
        for (const key in rootState.pool.poolsInfo) {
          if (
            Object.prototype.hasOwnProperty.call(rootState.pool.poolsInfo, key)
          ) {
            const pool = rootState.pool.poolsInfo[key];
            if (pool.shareToken === assetRecord.assetId) {
              name = pool.poolAssets
                .map(asset => assetList.find(x => x && x.assetId == +asset))
                .map(x => x?.name)
                .join(' | ');
              break;
            }
          }
        }
      }

      const balance = tokenInfo?.balance;
      // const balanceFormatted = tokenInfo?.balanceFormatted;
      const balanceFormatted = tokenInfo?.balance
        ? tokenInfo?.balanceFormatted
        : '0';

      return {
        ...assetRecord,
        name,
        shareToken,
        balance: balance || new BigNumber(0),
        balanceFormatted: balanceFormatted || '0',
      };
    });
  },
  assetListSMWallet: ({ assetList }) => assetList,
};
