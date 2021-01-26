
import Api from '../../api';
import { bnToBn } from '@polkadot/util';
import { bnToDec, decToBn } from '../../utils';

async function addLiquiditySMPool(account: string, asset1: string, asset2: string, amount: any, spotPrice: number) {
    return new Promise(async (resolve) => {
        const api = Api.getApi();
        const maxSellPrice = decToBn(bnToDec(amount).multipliedBy(spotPrice * 1.1));
    
        if (api && account) {
          const signer = await Api.getSinger(account);
          api.tx.amm
            .addLiquidity(asset1, asset2, amount, maxSellPrice)
            .signAndSend(account, { signer: signer }, ({ status }) => {
                resolve(status);
            });
        }
    });
}

async function withdrawLiquiditySMPool(account: string, asset1: string, asset2: string, liquidityBalance: any, selectedPool: any, percentage: number) {
    return new Promise(async (resolve) => {
        const api = Api.getApi();

        if (api && account && selectedPool) {
          const signer = await Api.getSinger(account);
          const liquidityToRemove = liquidityBalance
            .div(bnToBn(100))
            .mul(percentage);
    
          api.tx.amm
            .removeLiquidity(asset1, asset2, liquidityToRemove)
            .signAndSend(account, { signer: signer }, ({ status }) => {
                resolve(status);
            });
        }
    });
}

async function syncPoolsSMPool() {
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

    return {
        tokenTradeMap,
        shareTokenIds,
        poolInfo
    };
}

export {
    addLiquiditySMPool,
    withdrawLiquiditySMPool,
    syncPoolsSMPool,
}
