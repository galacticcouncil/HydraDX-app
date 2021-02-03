import Api from '../../api';
import { bnToBn, formatBalance } from "@polkadot/util";
import { bnToDec, decToBn } from '../../utils';

async function mintAssetSMWallet(account: any, assetId: any) {
    const api = Api.getApi();

    if (api && account) {
        const signer = await Api.getSinger(account);
        api.tx.faucet
        .mint(assetId, 100000000000000)
        .signAndSend(account, { signer: signer }, ({ events, status }) => {
            if (status.isReady) return Promise.resolve();
            // TODO:STUFF
        });
    }
}

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

async function swapSMTrade(account: string, asset1: string, asset2: string, amount: any, actionType: string) {
    return new Promise(async (resolve, reject) => {
        const api = Api.getApi();
    
        if (api && account && amount && asset1 != null && asset2 != null) {
          const signer = await Api.getSinger(account);
          if (actionType === 'buy') {
            api.tx.exchange
              //TODO: CALCULATE LIMITS FROM SPOT PRICE
              .buy(asset1, asset2, amount, bnToBn('100000000000000000'), false)
              .signAndSend(account, { signer: signer }, ({ events, status }: { events: any; status: any }) => {
                resolve({events, status});
              })
              .catch(() => {
                reject();
              });
          } else {
            api.tx.exchange
              //TODO: CALCULATE LIMITS FROM SPOT PRICE
              .sell(asset1, asset2, amount, bnToBn(1000), false)
              .signAndSend(account, { signer: signer }, ({ events, status }:  { events: any; status: any }) => {
                resolve({events, status});
              })
              .catch(() => {
                reject();
              });
          }
        }
    });
};

export {
    mintAssetSMWallet,
    addLiquiditySMPool,
    withdrawLiquiditySMPool,
    swapSMTrade
}