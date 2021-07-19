import BigNumber from 'bignumber.js';
import { Api } from 'hydradx-js';
import { Signer } from '@polkadot/api/types';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { encodeAddress } from '@polkadot/util-crypto';

// const decimalPlaces = 12;

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

export const getHydraDxFormattedAddress: (
  address: string,
  format?: number
) => string = (address = '', format = 63) => {
  return encodeAddress(address, format);
};

export const formatBalanceAmountBigN = (balance: BigNumber): AssetAmount => {
  // const amount = balance.div(`1e${decimalPlaces}`);
  return {
    amount: balance,
    amountFormatted: balance.toString(),
  };
};

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

export const getTransactionFeeInitial = (
  amount: BigNumber = new BigNumber(0)
): BigNumber => {
  return amount.multipliedBy(2).div(1000);
  // return amount.multipliedBy(1000).div(997);
};

export const getMinReceivedTradeAmount = (
  tradeAmount: BigNumber,
  slippage: BigNumber
): BigNumber => {
  const minPercentage = new BigNumber(100).minus(slippage);
  return tradeAmount.multipliedBy(minPercentage).div(100);
};

export const getMaxReceivedTradeAmount = (
  tradeAmount: BigNumber,
  slippage: BigNumber
): BigNumber => {
  const maxPercentage = new BigNumber(100).plus(slippage);
  return tradeAmount.multipliedBy(maxPercentage).div(100);
};

export const getPriceDecoratedShort = (priceValue: BigNumber): string => {
  let priceSuffix = '';
  let priceDivider = new BigNumber(1);

  if (!priceValue.isLessThanOrEqualTo(new BigNumber(1000000))) {
    priceSuffix = 'M';
    priceDivider = new BigNumber(1000000);
  } else if (!priceValue.isLessThanOrEqualTo(new BigNumber(1000))) {
    priceSuffix = 'K';
    priceDivider = new BigNumber(1000);
  }

  const valueDecorated = priceValue.dividedBy(priceDivider).decimalPlaces(1);

  return `${valueDecorated.toString()}${priceSuffix}`;
};
