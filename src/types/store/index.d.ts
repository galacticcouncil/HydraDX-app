type MergedState = {
  general: GeneralState;
  wallet: WalletState;
};

type MergedMutations = GeneralMutations & WalletMutations;

type MergedActions = GeneralActions & WalletActions;

type GeneralStore = GeneralStore<Pick<MergedState, 'general'>> &
  WalletStore<Pick<MergedState, 'wallet'>>;
