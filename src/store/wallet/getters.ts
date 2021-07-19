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
    return assetList
      .filter(
        assetRecord =>
          !assetRecord.name.startsWith('0x') ||
          (assetRecord.name.startsWith('0x') &&
            rootState.trade.shareTokenIds.includes(assetRecord.assetId))
      )
      .map(assetRecord => {
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
              Object.prototype.hasOwnProperty.call(
                rootState.pool.poolsInfo,
                key
              )
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

        const resultScope = {
          ...assetRecord,
          name,
          shareToken,

          totalBalance: tokenInfo?.totalBalance || new BigNumber(0),
          freeBalance: tokenInfo?.freeBalance || new BigNumber(0),
          feeFrozenBalance: tokenInfo?.feeFrozenBalance || new BigNumber(0),
          miscFrozenBalance: tokenInfo?.miscFrozenBalance || new BigNumber(0),
          reservedBalance: tokenInfo?.reservedBalance || new BigNumber(0),
        };

        return {
          ...resultScope,
          totalBalanceFormatted: resultScope.totalBalance.toString(),
          freeBalanceFormatted: resultScope.freeBalance.toString(),
          feeFrozenBalanceFormatted: resultScope.feeFrozenBalance.toString(),
          miscFrozenBalanceFormatted: resultScope.miscFrozenBalance.toString(),
          reservedBalanceFormatted: resultScope.reservedBalance.toString(),
        };
      });
  },
  assetListSMWallet: ({ assetList }) => assetList,
};
