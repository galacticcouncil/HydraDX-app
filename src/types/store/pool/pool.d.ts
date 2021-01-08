// type BN = import('bn.js');
// import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
// import { ActionContext } from 'vuex';

// ================================= STATE =====================================

type PoolInfo = {
  [key: string]: {
    poolAssets: number[];
    poolAssetNames: string[];
    shareToken: number;
  };
};

type LiquidityProperties = {
  asset1: number | null;
  asset2: number | null;
  actionType: string;
};

type PoolState = {
  liquidityAmount: BN;
  liquidityProperties: LiquidityProperties;
  // polling: {
  //   spot: NodeJS.Timeout | null;
  //   real: NodeJS.Timeout | null;
  // };
  poolInfo: PoolInfo;
  selectedPool: string | null;
};

// ================================ GETTERS ====================================

type PoolGetters = {
  poolInfoSMPool(
    state: PoolState,
    getters: MergedGetters,
    rootState: MergedState
  ): PoolInfo;
  liquidityAmountSMPool(state: PoolState): BN;
  selectedPoolSMPool(state: PoolState): string | null;
  liquidityPropertiesSMPool(state: PoolState): LiquidityProperties;
};

// =============================== MUTATION ====================================

type PoolMutations = {
  SET_SELECTED_POOL__POOL(state: PoolState, poolId: string | null): void;
  SET_POOL_INFO__POOL(state: PoolState, poolInfo: PoolInfo): void; //updatePoolInfo
  SET_LIQUIDITY_AMOUNT__POOL(state: PoolState, liquidityAmount: BN): void;
  SET_LIQUIDITY_PROPERTIES__POOL(
    state: PoolState,
    liquidityProperties: LiquidityProperties
  ): void;
};

// =============================== ACTIONS =====================================

type PoolActionAugments = Omit<
  ActionContext<PoolState, MergedState>,
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
  state: PoolState;
} & {
  rootState: MergedState;
};

type PoolActions = {
  changeSelectedPoolSMPool(
    context: PoolActionAugments,
    poolId: string | null
  ): void;
  addLiquiditySMPool(context: PoolActionAugments): void;
  withdrawLiquiditySMPool(context: PoolActionAugments): void;
  syncPoolsSMPool(context: PoolActionAugments): void;
};

// ================================ STORE ======================================

type PoolStore<S = PoolState> = Omit<
  VuexStore<S>,
  'commit' | 'getters' | 'dispatch'
> & {
  commit<
    K extends keyof PoolMutations,
    P extends Parameters<PoolMutations[K]>[1]
  >(
    key: K,
    payload?: P,
    options?: CommitOptions
  ): ReturnType<PoolMutations[K]>;
} & {
  getters: {
    [K in keyof PoolGetters]: ReturnType<PoolGetters[K]>;
  };
} & {
  dispatch<K extends keyof PoolActions>(
    key: K,
    payload?: Parameters<PoolActions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<PoolActions[K]>;
};
