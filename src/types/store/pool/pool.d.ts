// ================================= STATE =====================================

type PoolInfo = {
  poolAssets: string[];
  poolAssetNames: string[];
  shareToken: number;
};

type PoolsInfoList = {
  [key: string]: PoolInfo;
};

type PoolState = {
  poolsInfo: PoolsInfoList;
};

// ================================ GETTERS ====================================

type PoolGetters = {
  poolsInfoSMPool(
    state: PoolState,
    getters: MergedGetters,
    rootState: MergedState
  ): PoolsInfoList;
};

// =============================== MUTATION ====================================

type PoolMutations = {
  SET_POOLS_INFO__POOL(state: PoolState, poolsInfo: PoolsInfoList): void; //updatePoolsInfo
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
