// ================================= STATE =====================================

type NotificationState = {
  generalLoading: boolean;
  generalLoadingShowReconnectControl: boolean;
  generalLoadingSpinner: boolean;
  generalLoadingMessages: string[];
};

// ================================ GETTERS ====================================

type NotificationGetters = {
  generalLoadingSMNotification(state: NotificationState): boolean;
  generalLoadingSpinnerSMNotification(state: NotificationState): boolean;
  generalLoadingMessagesSMNotification(state: NotificationState): string[];
  generalLoadingShowReconnectControlSMNotification(
    state: NotificationState
  ): boolean;
};

// =============================== MUTATION ====================================

type NotificationMutations = {
  SET_GENERAL_LOADING__NOTIFICATION(
    state: NotificationState,
    loading: boolean
  ): void;
  SET_GENERAL_LOADING_SPINNER__NOTIFICATION(
    state: NotificationState,
    loading: boolean
  ): void;
  SET_GENERAL_LOADING_SHOW_RECONNECT_CONTROL__NOTIFICATION(
    state: NotificationState,
    loading: boolean
  ): void;
  SET_GENERAL_LOADING_MESSAGES__NOTIFICATION(
    state: NotificationState,
    messageData: { action: string; message: string }
  ): void;
};

// =============================== ACTIONS =====================================

type NotificationActionAugments = Omit<
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
  state: NotificationState;
} & {
  rootState: MergedState;
};

type NotificationActions = {
  // updateBlockHashSMGeneral(
  //   context: NotificationActionAugments,
  //   payload: string | null
  // ): void;
};

// ================================ STORE ======================================

// Setup store type
type NotificationStore<S = NotificationState> = Omit<
  VuexStore<S>,
  'commit' | 'getters' | 'dispatch'
> & {
  commit<
    K extends keyof NotificationMutations,
    P extends Parameters<NotificationMutations[K]>[1]
  >(
    key: K,
    payload?: P,
    options?: CommitOptions
  ): ReturnType<NotificationMutations[K]>;
} & {
  getters: {
    [K in keyof NotificationGetters]: ReturnType<NotificationGetters[K]>;
  };
} & {
  dispatch<K extends keyof NotificationActions>(
    key: K,
    payload?: Parameters<NotificationActions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<NotificationActions[K]>;
};
