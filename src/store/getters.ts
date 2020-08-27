import { GetterTree } from "vuex";

export const getters: GetterTree<State, State> = {
  account: ({ account }) => account,
  accountInfo: ({ account, accountList }) => {
    return accountList.find(x => x.address === account);
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
              .join(" | ");
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
        balanceFormatted: balanceFormatted || 0
      };
    });
    return balances;
  },
  assetList: ({ assetList }) => assetList,
  blockInfo: ({ blockNumber, blockHash }) => {
    return {
      blockNumber,
      blockHash
    };
  },
  currentScreen: ({ currentScreen }) => currentScreen,
  extensionInfo: ({ extensionInitialized, extensionPresent }) => {
    return {
      extensionInitialized,
      extensionPresent
    };
  },
  poolInfo: ({ poolInfo, assetList }) => {
    for (const pool in poolInfo) {
      poolInfo[pool].poolAssetNames = [];
      poolInfo[pool].poolAssetNames[0] =
        assetList[poolInfo[pool].poolAssets[0]].name;
      poolInfo[pool].poolAssetNames[1] =
        assetList[poolInfo[pool].poolAssets[1]].name;
    }
    return poolInfo;
  },
  spotPrice: ({ spotPrice }) => spotPrice,
  tokenTradeMap: ({ tokenTradeMap }) => {
    return tokenTradeMap;
  },
  tradeAmount: ({ tradeAmount }) => tradeAmount,
  sellPrice: ({ sellPrice }) => sellPrice,
  transactionList: ({ transactions, unpairedTransactions }) => {
    const allTransactions = { ...transactions };
    for (const transaction in unpairedTransactions) {
      const id = "unpaired" + Math.random();
      const transactionData = unpairedTransactions[transaction];
      transactionData.id = id;
      allTransactions[id] = transactionData;
    }

    return allTransactions;
  },
  tradeProperties: ({ tradeProperties }) => tradeProperties
};
