import { bnToBn } from '@polkadot/util';
import BN from 'bn.js';
import { formatBalance } from '@polkadot/util';
import BigNumber from 'bignumber.js';
import { Api } from 'hydradx-js';

import { Signer } from '@polkadot/api/types';
import { web3FromAddress } from '@polkadot/extension-dapp';

const decimalPlaces = 12;

// export const formatBalanceAmount = (balance: BN): AssetAmount => {
//   const bnDecimals = bnToBn(decimalPlaces);
//   //TODO: Precision
//   const baseAmount = bnToBn(10).pow(bnDecimals.sub(bnToBn(4)));
//   const inputAmount = balance.div(baseAmount).toNumber() / 10 ** 4;
//   return {
//     amount: balance,
//     inputAmount: inputAmount,
//     amountFormatted: formatBalance(balance),
//   };
// };

export const formatBalanceAmountBigN = (balance: BigNumber): AssetAmount => {
  const amount = balance.div(`1e${decimalPlaces}`);
  return {
    amount,
    amountFormatted: amount.toString(),
  };
};

// const decToBn = (bignumber: BigNumber): BN => bnToBn(bignumber.toString());
//
// const bnToDec = (bn: BN): BigNumber => new BigNumber(bn.toString());

// export { decToBn, bnToDec, formatBalanceAmount };

export const getSigner = async (account: string): Promise<Signer> => {
  const injector = await web3FromAddress(account);
  return injector.signer;
};

export const calculateSpotAmount = async (
  asset1: string,
  asset2: string,
  amount: BigNumber
): Promise<BigNumber> => {
  const api = Api.getApi();

  try {
    const amountResp = await api.hydraDx.query.calculateSpotAmount(
      asset1,
      asset2,
      amount
    );
    return amountResp;
  } catch (e) {
    console.log(e);
    return new BigNumber(0);
  }
};
