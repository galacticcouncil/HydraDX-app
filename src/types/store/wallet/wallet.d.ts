// type BN = import('bn.js');
// import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
// import { ActionContext } from 'vuex';

// ================================= STATE =====================================

type AccountInfo = {
  address: string;
  name: string;
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

type WalletState = {
  account: string | null;
  accountList: AccountInfo[];
  assetBalances: AssetBalance[];
  assetList: AssetRecord[];
};

// ================================ GETTERS ====================================

type WalletGetters = {
  account(state: WalletState): string | null;
  accountInfo(state: WalletState): AccountInfo | null;
  accountList(state: WalletState): AccountInfo[];
  assetBalances(
    state: WalletState,
    getters: MergedGetters,
    rootState: MergedState
  ): AssetBalance[];
  assetList(state: WalletState): AssetRecord[];
};

// =============================== MUTATION ====================================

type WalletMutations = {
  SET_ACCOUNT__WALLET(state: WalletState, account: string | null): void;
  SET_ACCOUNT_LIST__WALLET(
    state: WalletState,
    accountList: AccountInfo[]
  ): void;
  SET_ASSET_BALANCES__WALLET(
    state: WalletState,
    assetBalances: AssetBalance[]
  ): void;
  SET_ASSET_LIST__WALLET(state: WalletState, assetList: AssetRecord[]): void;
};

// =============================== ACTIONS =====================================

type WalletActionAugments = Omit<
  ActionContext<WalletState, MergedState>,
  'commit' | 'dispatch' | 'state' | 'rootState'
> & {
  commit<K extends keyof MergedMutations>(
    key: K,
    payload: Parameters<MergedMutations[K]>[1]
  ): ReturnType<MergedMutations[K]>;
} & {
  dispatch<K extends keyof MergedActions>(
    key: K,
    payload?: Parameters<MergedActions[K]>[1]
  ): ReturnType<MergedActions[K]>;
} & {
  state: WalletState;
} & {
  rootState: MergedState;
};

type WalletActions = {
  changeAccountSMWallet(
    context: WalletActionAugments,
    account: string | null
  ): void;
  updateWalletInfoSMWallet(
    context: WalletActionAugments,
    accountsWithMeta: InjectedAccountWithMeta[]
  ): void;
  syncAssetBalancesSMWallet(context: WalletActionAugments): Promise;
  syncAssetListSMWallet(context: WalletActionAugments): Promise;
};

// ================================ STORE ======================================

type WalletStore<S = WalletState> = Omit<
  VuexStore<S>,
  'commit' | 'getters' | 'dispatch'
> & {
  commit<
    K extends keyof WalletMutations,
    P extends Parameters<WalletMutations[K]>[1]
  >(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<WalletMutations[K]>;
} & {
  getters: {
    [K in keyof WalletGetters]: ReturnType<WalletGetters[K]>;
  };
} & {
  dispatch<K extends keyof WalletActions>(
    key: K,
    payload: Parameters<WalletActions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<WalletActions[K]>;
};
