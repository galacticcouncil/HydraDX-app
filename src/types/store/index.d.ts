type BN = import("bn.js");

type AccountInfo = {
  name: string;
  address: string;
};

type AssetRecord = {
  assetId: number;
  name: string;
  icon?: string;
};

type AssetBalance = {
  assetId: number;
  balance: BN;
  balanceFormatted: string;
};

type AssetAmount = {
  amount: BN;
  inputAmount: number;
  amountFormatted: string;
};

// TRANSACTION PROGRESS
// 0 = initiated
// 1 = pending
// 2 = inBlock
// 3 = finalized
// 4 = failed
// 5 = canceled
type Transaction = {
  id?: string;
  index?: number;
  accountId: string;
  progress: number;
  block?: number;
  type: string;
  tokenIn: number;
  tokenOut: number;
  amountIn: string;
  amountOut?: string;
  expectedOut?: string;
  matchIn?: number;
  matchOut?: number;
};

type TokenTradeMap = { [key: number]: number[] };

type State = {
  actions: [];
  account: string | null;
  accountList: AccountInfo[];
  assetBalances: AssetBalance[];
  assetList: AssetRecord[];
  blockHash: string | null;
  blockNumber: number;
  currentScreen: string;
  extensionInitialized: boolean;
  extensionPresent: boolean;
  pendingAction: boolean;
  poolInfo: {
    [key: string]: {
      poolAssets: number[];
      poolAssetNames: string[];
      shareToken: number;
    };
  };
  savedScreen: boolean;
  subscriptions: [];
  shareTokenIds: number[];
  selectedPool: string | null;
  sellPrice: AssetAmount;
  spotPrice: AssetAmount;
  tokenTradeMap: TokenTradeMap;
  liquidityAmount: BN;
  tradeAmount: BN;
  liquidityProperties: {
    asset1: number | null;
    asset2: number | null;
    actionType: string;
  };
  tradeProperties: {
    asset1: number | null;
    asset2: number | null;
    actionType: string;
  };
  polling: {
    spot: NodeJS.Timeout | null;
    real: NodeJS.Timeout | null;
  };
  transactions: {
    [key: string]: Transaction;
  };
  unpairedTransactions: {
    [key: string]: Transaction;
  };
};
