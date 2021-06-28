import { Signer } from '@polkadot/api/types';
import { web3FromAddress } from '@polkadot/extension-dapp';

export const getSigner = async (account: string): Promise<Signer> => {
  const injector = await web3FromAddress(account);
  return injector.signer;
};
