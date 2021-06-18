// ================================= STATE =====================================

type PoolInfo = {
  poolAssets: string[];
  poolAssetNames: string[];
  shareToken: number;
};

type PoolsInfoList = {
  [key: string]: PoolInfo;
};

type LiquidityProperties = {
  asset1: string | null;
  asset2: string | null;
  actionType: string;
};

type NewPoolProperties = {
  asset1: string | null;
  asset2: string | null;
  initialPrice: BigNumber;
  amount: BigNumber;
};

type PoolState = {
  liquidityAmount: BigNumber;
  liquidityProperties: LiquidityProperties;
  // polling: {
  //   spot: NodeJS.Timeout | null;
  //   real: NodeJS.Timeout | null;
  // };
  poolInfo: PoolsInfoList;
  selectedPool: string | null;

  createPoolDialogOpen: boolean;
  newPoolProperties: NewPoolProperties;

  addRemovePoolLiquidityDialogOpen: boolean;
};

// ================================ GETTERS ====================================

type PoolGetters = {
  poolInfoSMPool(
    state: PoolState,
    getters: MergedGetters,
    rootState: MergedState
  ): PoolsInfoList;
  liquidityAmountSMPool(state: PoolState): BigNumber;
  selectedPoolSMPool(state: PoolState): string | null;
  liquidityPropertiesSMPool(state: PoolState): LiquidityProperties;
  newPoolPropertiesSMPool(state: PoolState): NewPoolProperties;
  createPoolDialogOpenSMPool(state: PoolState): boolean;
  addRemovePoolLiquidityDialogOpenSMPool(state: PoolState): boolean;
};

// =============================== MUTATION ====================================

type PoolMutations = {
  SET_SELECTED_POOL__POOL(state: PoolState, poolId: string | null): void;
  SET_CREATE_POOL_DIALOG_OPEN__POOL(state: PoolState, isOpen: boolean): void;
  SET_ADD_REMOVE_POOL_LIQUIDITY_DIALOG__POOL(
    state: PoolState,
    isOpen: boolean
  ): void;
  SET_POOL_INFO__POOL(state: PoolState, poolInfo: PoolsInfoList): void; //updatePoolInfo
  SET_LIQUIDITY_AMOUNT__POOL(
    state: PoolState,
    liquidityAmount: BigNumber
  ): void;
  SET_LIQUIDITY_PROPERTIES__POOL(
    state: PoolState,
    liquidityProperties: LiquidityProperties
  ): void;
  SET_NEW_POOL_PROPERTIES__POOL(
    state: PoolState,
    liquidityProperties: NewPoolProperties
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
  changeLiquidityAmountSMPool(
    context: PoolActionAugments,
    liquidityAmount: BigNumber
  ): void;
  changeNewPoolPropertiesSMPool(
    context: PoolActionAugments,
    newPoolProperties: NewPoolProperties
  ): void;
  addLiquiditySMPool(context: PoolActionAugments): void;
  withdrawLiquiditySMPool(context: PoolActionAugments): void;
  createPoolSMPool(context: PoolActionAugments): void;
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
