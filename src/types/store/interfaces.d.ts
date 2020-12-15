type BN = import('bn.js');

type AccountInfo = {
  name: string;
  address: string;
};
type AssetBalance = {
  assetId: number;
  balance: BN;
  balanceFormatted: string;
};
type AssetRecord = {
  assetId: number;
  name: string;
  icon?: string;
};
