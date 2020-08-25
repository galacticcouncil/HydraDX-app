import { bnToBn } from "@polkadot/util";
import BN from "bn.js";
import { formatBalance } from "@polkadot/util";

const decimalPlaces = 12;
const bnDecimals = bnToBn(decimalPlaces);
//TODO: Precision
const baseAmount = bnToBn(10).pow(bnDecimals.sub(bnToBn(4)));

const formatInputAmount = (amount: number) => {
  const normalAmount = amount
    ? bnToBn(Math.round(amount * 10 ** 4)).mul(baseAmount)
    : bnToBn(0);
  return {
    amount: normalAmount,
    inputAmount: amount,
    amountFormatted: formatBalance(normalAmount)
  };
};

const formatBalanceAmount = (balance: BN) => {
  const bnDecimals = bnToBn(decimalPlaces);
  //TODO: Precision
  const baseAmount = bnToBn(10).pow(bnDecimals.sub(bnToBn(4)));
  const inputAmount = balance.div(baseAmount).toNumber() / 10 ** 4;
  return {
    amount: balance,
    inputAmount: inputAmount,
    amountFormatted: formatBalance(balance)
  };
};

export { formatBalanceAmount, formatInputAmount };
