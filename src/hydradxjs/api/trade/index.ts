import Api from '../../api';
import { bnToBn } from '@polkadot/util';

async function getSpotPriceSMTrade(asset1: string, asset2: string) {
    const api = Api.getApi();
    
    if (api) {
      // @ts-expect-error TS-2339
      const amountData = await api.rpc.amm.getSpotPrice(asset1, asset2, 1000000000000);
      const amount = amountData.amount;

      return amount;
    }
};

async function getSellPriceSMTrade(asset1: string, asset2: string, tradeAmount: any, actionType: string) {
    const api = Api.getApi();
    
    if (api) {
        let amount = bnToBn(0);

        if (tradeAmount) {
            if (actionType === 'sell') {
                // @ts-expect-error TS-2339
                const amountData = await api.rpc.amm.getSellPrice(asset1, asset2, tradeAmount);
                amount = amountData.amount;
            } else {
                // @ts-expect-error TS-2339
                const amountData = await api.rpc.amm.getBuyPrice(asset1, asset2, tradeAmount);
                amount = amountData.amount;
            }
        }
        return amount;
    }
};

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
    getSpotPriceSMTrade,
    getSellPriceSMTrade,
    swapSMTrade
};