type MergedState = {
  general: GeneralState;
  wallet: WalletState;
  pool: PoolState;
  trade: TradeState;
  notification: NotificationState;
};

type MergedGetters = GeneralGetters &
  WalletGetters &
  PoolGetters &
  TradeGetters &
  NotificationGetters;

type MergedMutations = GeneralMutations &
  WalletMutations &
  PoolMutations &
  TradeMutations &
  NotificationMutations;

type MergedActions = GeneralActions &
  WalletActions &
  PoolActions &
  TradeActions &
  NotificationActions;

type RootStore = GeneralStore<Pick<MergedState, 'general'>> &
  WalletStore<Pick<MergedState, 'wallet'>> &
  PoolStore<Pick<MergedState, 'pool'>> &
  TradeStore<Pick<MergedState, 'trade'>> &
  NotificationStore<Pick<MergedState, 'notification'>>;
