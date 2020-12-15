import { WalletStateTypes } from '@/store/interfaces';

const savedAccount = localStorage.getItem('account');

export const state: WalletStateTypes = {
  account: savedAccount || null,
  accountList: [],

  assetBalances: [],
  assetList: [],
};
