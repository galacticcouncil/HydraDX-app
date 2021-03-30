// ================================= STATE =====================================

type GeneralState = {
  blockHash: string | null;
  blockNumber: number;
  currentScreen: string;
  savedScreen: boolean;
  actions: string[];
  pendingAction: boolean;
  generalLoading: boolean;
  extensionInitialized: boolean;
  extensionPresent: boolean;
  apiConnectionValid: boolean;
  generalLoadingMessages: string[];
};

// ================================ GETTERS ====================================

type GeneralGetters = {
  getBlockHashSMGeneral(state: GeneralState): string | null;
  getBlockNumberSMGeneral(state: GeneralState): number;
  blockInfoSMGeneral(
    state: GeneralState
  ): { blockHash: string | null; blockNumber: number };
  currentScreenSMGeneral(state: GeneralState): string;
  actionsSMGeneral(state: GeneralState): string[];
  extensionInfoSMGeneral(
    state: GeneralState
  ): { extensionInitialized: boolean; extensionPresent: boolean };
  pendingActionSMGeneral(state: GeneralState): boolean;
  apiConnectionValidSMGeneral(state: GeneralState): boolean;
};

// =============================== MUTATION ====================================

type GeneralMutations = {
  SET_PENDING_ACTION__GENERAL(state: GeneralState, pending: boolean): void;
  SET_API_CONNECTION_VALID__GENERAL(state: GeneralState, status: boolean): void;
  SET_BLOCK_NUMBER__GENERAL(state: GeneralState, payload: number): void;
  SET_BLOCK_HASH__GENERAL(state: GeneralState, payload: string | null): void;
  SET_BLOCK_INFO__GENERAL(
    state: GeneralState,
    payload: { blockNumber: number; blockHash: string | null }
  ): void;
  SET_EXTENSION_PRESENT__GENERAL( //setExtensionPresent
    state: GeneralState,
    extensionPresent: boolean
  ): void;
  SET_EXTENSION_INITIALIZED__GENERAL( //setExtensionInitialized
    state: GeneralState,
    extensionInitialized: boolean
  ): void;
  SET_SCREEN__GENERAL(state: GeneralState, screen: string): void;

  ADD_ACTION__GENERAL(state: GeneralState, actions: string[]): void;
  CLEAR_ACTION__GENERAL(state: GeneralState, actionsForRemove: string[]): void;
};

// =============================== ACTIONS =====================================

type GeneralActionAugments = Omit<
  ActionContext<GeneralState, MergedState>,
  'commit' | 'state' | 'dispatch' | 'rootState'
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
  state: GeneralState;
} & {
  rootState: MergedState;
};

type GeneralActions = {
  updateBlockHashSMGeneral(
    context: GeneralActionAugments,
    payload: string | null
  ): void;
  updateBlockNumberSMGeneral(
    context: GeneralActionAugments,
    payload: number
  ): void;
  initializeApiSMGeneral(context: GeneralActionAugments): Promise;
  initializePolkadotExtensionSMGeneral(context: GeneralActionAugments): Promise;
};

// ================================ STORE ======================================

// Setup store type
type GeneralStore<S = GeneralState> = Omit<
  VuexStore<S>,
  'commit' | 'getters' | 'dispatch'
> & {
  commit<
    K extends keyof GeneralMutations,
    P extends Parameters<GeneralMutations[K]>[1]
  >(
    key: K,
    payload?: P,
    options?: CommitOptions
  ): ReturnType<GeneralMutations[K]>;
} & {
  getters: {
    [K in keyof GeneralGetters]: ReturnType<GeneralGetters[K]>;
  };
} & {
  dispatch<K extends keyof GeneralActions>(
    key: K,
    payload?: Parameters<GeneralActions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<GeneralActions[K]>;
};
