// ================================= STATE =====================================

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

type SinglePoolState = {
  liquidityAmount: BigNumber;
  liquidityProperties: LiquidityProperties;
  selectedPool: string | null;

  createPoolDialogOpen: boolean;
  newPoolProperties: NewPoolProperties;

  addRemovePoolLiquidityDialogOpen: boolean;
};

// ================================ GETTERS ====================================

type SinglePoolGetters = {
  liquidityAmountSMSinglePool(state: SinglePoolState): BigNumber;
  selectedPoolSMSinglePool(state: SinglePoolState): string | null;
  liquidityPropertiesSMSinglePool(state: SinglePoolState): LiquidityProperties;
  newPoolPropertiesSMSinglePool(state: SinglePoolState): NewPoolProperties;
  createPoolDialogOpenSMSinglePool(state: SinglePoolState): boolean;
  addRemovePoolLiquidityDialogOpenSMSinglePool(state: SinglePoolState): boolean;
};

// =============================== MUTATION ====================================

type SinglePoolMutations = {
  SET_SELECTED_POOL__SINGLE_POOL(state: SinglePoolState, poolId: string | null): void;
  SET_CREATE_POOL_DIALOG_OPEN__SINGLE_POOL(
    state: SinglePoolState,
    isOpen: boolean
  ): void;
  SET_ADD_REMOVE_POOL_LIQUIDITY_DIALOG__SINGLE_POOL(
    state: SinglePoolState,
    isOpen: boolean
  ): void;
  SET_LIQUIDITY_AMOUNT__SINGLE_POOL(
    state: SinglePoolState,
    liquidityAmount: BigNumber
  ): void;
  SET_LIQUIDITY_PROPERTIES__SINGLE_POOL(
    state: SinglePoolState,
    liquidityProperties: LiquidityProperties
  ): void;
  SET_NEW_POOL_PROPERTIES__SINGLE_POOL(
    state: SinglePoolState,
    liquidityProperties: NewPoolProperties
  ): void;
};

// =============================== ACTIONS =====================================

type SinglePoolActionAugments = Omit<
  ActionContext<SinglePoolState, MergedState>,
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
  state: SinglePoolState;
} & {
  rootState: MergedState;
};

type SinglePoolActions = {
  changeSelectedPoolSMSinglePool(
    context: SinglePoolActionAugments,
    poolId: string | null
  ): void;
  changeLiquidityAmountSMSinglePool(
    context: SinglePoolActionAugments,
    liquidityAmount: BigNumber
  ): void;
  changeNewPoolPropertiesSMSinglePool(
    context: SinglePoolActionAugments,
    newPoolProperties: NewPoolProperties
  ): void;
  addLiquiditySMSinglePool(context: SinglePoolActionAugments): void;
  withdrawLiquiditySMSinglePool(context: SinglePoolActionAugments): void;
  createPoolSMSinglePool(context: SinglePoolActionAugments): void;
};

// ================================ STORE ======================================

type SinglePoolStore<S = SinglePoolState> = Omit<
  VuexStore<S>,
  'commit' | 'getters' | 'dispatch'
> & {
  commit<
    K extends keyof SinglePoolMutations,
    P extends Parameters<SinglePoolMutations[K]>[1]
  >(
    key: K,
    payload?: P,
    options?: CommitOptions
  ): ReturnType<SinglePoolMutations[K]>;
} & {
  getters: {
    [K in keyof SinglePoolGetters]: ReturnType<SinglePoolGetters[K]>;
  };
} & {
  dispatch<K extends keyof SinglePoolActions>(
    key: K,
    payload?: Parameters<SinglePoolActions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<SinglePoolActions[K]>;
};
