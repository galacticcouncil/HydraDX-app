
// ================================= STATE =====================================
// import BigNumber from "bignumber.js";

type AssetAmount = {
  amount: BigNumber;
  amountFormatted: string;
};

type TokenTradeMap = { [key: number]: number[] };

type TradeProperties = {
  asset1: string | null;
  asset2: string | null;
  actionType: string;
};

type Transactions = {
  [key: string]: Transaction;
};

type TradeState = {
  polling: {
    spot: NodeJS.Timeout | null;
    real: NodeJS.Timeout | null;
  };
  sellPrice: AssetAmount;
  shareTokenIds: number[];
  spotPrice: AssetAmount;
  subscriptions: [];
  tokenTradeMap: TokenTradeMap;
  tradeAmount: BigNumber;
  tradeProperties: TradeProperties;
  transactions: Transactions;
  unpairedTransactions: Transactions;
};

// ================================ GETTERS ====================================

type TradeGetters = {
  spotPriceSMTrade(state: TradeState): AssetAmount;
  tokenTradeMapSMTrade(state: TradeState): TokenTradeMap;
  tradeAmountSMTrade(state: TradeState): BigNumber;
  sellPriceSMTrade(state: TradeState): AssetAmount;
  transactionListSMTrade(state: TradeState): Transactions;
  tradePropertiesSMTrade(state: TradeState): TradeProperties;
};

// =============================== MUTATION ====================================

type TradeMutations = {
  SET_SELL_PRICE_TIMER__TRADE(
    state: TradeState,
    timer: NodeJS.Timeout | null
  ): void;
  SET_SPOT_PRICE_TIMER__TRADE(
    state: TradeState,
    timer: NodeJS.Timeout | null
  ): void;
  SET_SHARE_TOKEN_IDS__TRADE(state: TradeState, shareTokenIds: number[]): void;
  SET_TRADE_AMOUNT__TRADE(state: TradeState, tradeAmount: BigNumber): void;
  SET_TRADE_PROPERTIES__TRADE(
    state: TradeState,
    tradeProperties: TradeProperties
  ): void;
  UPDATE_TRANSACTIONS__TRADE(
    state: TradeState,
    transaction: Transactions
  ): void;
  UPDATE_SELL_PRICE__TRADE(state: TradeState, sellPrice: BigNumber): void;
  UPDATE_SPOT_PRICE__TRADE(state: TradeState, spotPrice: BigNumber): void;
  UPDATE_TOKEN_TRADE_MAP__TRADE(
    state: TradeState,
    tokenTradeMap: TokenTradeMap
  ): void;
};

// =============================== ACTIONS =====================================

type TradeActionAugments = Omit<
  ActionContext<TradeState, MergedState>,
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
  state: TradeState;
} & {
  rootState: MergedState;
};

type TradeActions = {
  changeTradeAmountSMTrade(context: TradeActionAugments, tradeAmount: BigNumber): void;
  changeTradePropertiesSMTrade(
    context: TradeActionAugments,
    tradeProperties: TradeProperties
  ): void;
  getSpotPriceSMTrade(context: TradeActionAugments): void;
  getSellPriceSMTrade(context: TradeActionAugments): void;
  swapSMTrade(context: TradeActionAugments): void;
  updateTransactionsSMTrade(
    context: TradeActionAugments,
    {
      events,
      currentIndex,
      status,
      instanceOwner,
    }: {
      events: EventRecord[];
      currentIndex?: number;
      status?: ExtrinsicStatus;
      instanceOwner?: string;
    }
  ): void;
};

// ================================ STORE ======================================

type TradeStore<S = TradeState> = Omit<
  VuexStore<S>,
  'commit' | 'getters' | 'dispatch'
> & {
  commit<
    K extends keyof TradeMutations,
    P extends Parameters<TradeMutations[K]>[1]
  >(
    key: K,
    payload?: P,
    options?: CommitOptions
  ): ReturnType<TradeMutations[K]>;
} & {
  getters: {
    [K in keyof TradeGetters]: ReturnType<TradeGetters[K]>;
  };
} & {
  dispatch<K extends keyof TradeActions>(
    key: K,
    payload?: Parameters<TradeActions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<TradeActions[K]>;
};
