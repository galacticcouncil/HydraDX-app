import { bnToBn } from '@polkadot/util';
import BN from 'bn.js';
import { formatBalance } from '@polkadot/util';
import BigNumber from 'bignumber.js';

const decimalPlaces = 12;

const formatBalanceAmount = (balance: BN): AssetAmount => {
  const bnDecimals = bnToBn(decimalPlaces);
  //TODO: Precision
  const baseAmount = bnToBn(10).pow(bnDecimals.sub(bnToBn(4)));
  const inputAmount = balance.div(baseAmount).toNumber() / 10 ** 4;
  return {
    amount: balance,
    inputAmount: inputAmount,
    amountFormatted: formatBalance(balance),
  };
};

const decToBn = (bignumber: BigNumber): BN => bnToBn(bignumber.toString());

const bnToDec = (bn: BN): BigNumber => new BigNumber(bn.toString());

export { decToBn, bnToDec, formatBalanceAmount };
