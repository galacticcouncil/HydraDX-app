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

// --------------------------------------
// --------------------------------------
// --------------------------------------

import type { Codec } from '@polkadot/types/types';
import type { Balance } from '@polkadot/types/interfaces/runtime';

interface AccountAmount extends Codec {
  free?: Balance;
}

/**
 * getTokenAmount returns tokens amount for provided account (pool, wallet)
 * @param accountId: string
 * @param assetId: string
 */
const getTokenAmount = async (
  accountId: string,
  assetId: string
): Promise<number | null> => {
  const api = Api.getApi();
  if (assetId === '0') {
    return (await api.query.system.account(accountId)).data.free.toNumber();
  } else {
    const amount: AccountAmount = await api.query.tokens.accounts(
      accountId,
      assetId
    );
    return amount.free ? amount.free.toNumber() : null;
  }
};

/**
 * getAssetsAmounts fetches amounts for pair of assets within pool.
 * @param asset1Id: string | null
 * @param asset2Id: string | null
 */
export const getAssetsAmounts = async (
  asset1Id: string | null,
  asset2Id: string | null
): Promise<{
  asset1: string | null;
  asset2: string | null;
  accountAddress: string;
} | null> => {
  if (
    (asset1Id !== null && asset1Id.length === 0) ||
    asset1Id === null ||
    (asset2Id !== null && asset2Id.length === 0) ||
    asset2Id === null
  )
    return null;

  const api = Api.getApi();

  const poolsList = await api.query.amm.poolAssets.entries();

  //TODO should be create type for poolsList (api.createType())
  const parsedPoolsList = poolsList.map(item => {
    return [item[0].toHuman(), item[1].toHuman()];
  });

  /**
   * parsedPoolsList has next structure
   * [
   *    [['7MK4PSbXskZhKTiGk4K4w7Ut59ZZndUupZxMHBDxgxiGZgpa'], ['1', '2']],
   *    [['7Hx1UVo75qgr8cy7VFqGTL4r99HRVWdn864HFter2aa2LSqW'], ['0', '1']],
   * ]
   */

  const currentPool = parsedPoolsList.find(
    poolInfo =>
      asset1Id !== null &&
      asset2Id !== null &&
      poolInfo[1] &&
      //@ts-ignore
      poolInfo[1].includes(asset1Id) &&
      //@ts-ignore
      poolInfo[1].includes(asset2Id)
  );

  //@ts-ignore
  const currentPoolId = currentPool ? currentPool[0][0] : null;

  if (!currentPoolId) {
    return null;
  }

  const asset1Amount = await getTokenAmount(currentPoolId, asset1Id);

  const asset2Amount = await getTokenAmount(currentPoolId, asset2Id);

  return {
    asset1: asset1Amount ? asset1Amount.toString() : null,
    asset2: asset2Amount ? asset2Amount.toString() : null,
    accountAddress: currentPoolId,
  };
};
