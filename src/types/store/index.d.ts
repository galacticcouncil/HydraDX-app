type MergedState = {
  general: GeneralState;
  wallet: WalletState;
  pool: PoolState;
  singlePool: SinglePoolState;
  trade: TradeState;
  notification: NotificationState;
};

type MergedGetters = GeneralGetters &
  WalletGetters &
  PoolGetters &
  SinglePoolGetters &
  TradeGetters &
  NotificationGetters;

type MergedMutations = GeneralMutations &
  WalletMutations &
  PoolMutations &
  SinglePoolMutations &
  TradeMutations &
  NotificationMutations;

type MergedActions = GeneralActions &
  WalletActions &
  PoolActions &
  SinglePoolActions &
  TradeActions &
  NotificationActions;

type RootStore = GeneralStore<Pick<MergedState, 'general'>> &
  WalletStore<Pick<MergedState, 'wallet'>> &
  PoolStore<Pick<MergedState, 'pool'>> &
  SinglePoolStore<Pick<MergedState, 'singlePool'>> &
  TradeStore<Pick<MergedState, 'trade'>> &
  NotificationStore<Pick<MergedState, 'notification'>>;
