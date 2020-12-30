type MergedState = {
  general: GeneralState;
  wallet: WalletState;
  pool: PoolState;
  trade: TradeState;
};

type MergedGetters = GeneralGetters &
  WalletGetters &
  PoolGetters &
  TradeGetters;

type MergedMutations = GeneralMutations &
  WalletMutations &
  PoolMutations &
  TradeMutations;

type MergedActions = GeneralActions &
  WalletActions &
  PoolActions &
  TradeActions;

type RootStore = GeneralStore<Pick<MergedState, 'general'>> &
  WalletStore<Pick<MergedState, 'wallet'>> &
  PoolStore<Pick<MergedState, 'pool'>> &
  TradeStore<Pick<MergedState, 'trade'>>;
