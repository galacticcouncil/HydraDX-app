import { GetterTree } from 'vuex';

export const getters: GetterTree<GeneralState, MergedState> & GeneralGetters = {
  getBlockHashSMGeneral: state => {
    return state.blockHash;
  },
  getBlockNumberSMGeneral: state => {
    return state.blockNumber;
  },
  chainAddressFormatSMGeneral: state => {
    return state.chainAddressFormat;
  },
  blockInfoSMGeneral: ({ blockNumber, blockHash }) => {
    return {
      blockNumber,
      blockHash,
    };
  },
  currentScreenSMGeneral: state => {
    return state.currentScreen;
  },
  extensionInfoSMGeneral: (
    { extensionInitialized, extensionPresent },
    getters,
    rootState
  ) => {
    return {
      extensionInitialized,
      extensionPresent,
      accountSelected: !!rootState.wallet.account,
    };
  },
  actionsSMGeneral: state => {
    return state.actions;
  },
  pendingActionSMGeneral: ({ pendingAction }) => pendingAction,
  apiConnectionValidSMGeneral: ({ apiConnectionValid }) => apiConnectionValid,
};
