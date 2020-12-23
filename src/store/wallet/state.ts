const savedAccount = localStorage.getItem('account');

export const state: WalletState = {
  account: savedAccount || null,
  accountList: [],
  assetBalances: [],
  assetList: [],
};
