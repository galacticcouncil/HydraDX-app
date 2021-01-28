import { GetterTree } from 'vuex';

export const getters: GetterTree<GeneralState, MergedState> & GeneralGetters = {
  getBlockHashSMGeneral: state => {
    return state.blockHash;
  },
  getBlockNumberSMGeneral: state => {
    return state.blockNumber;
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
  extensionInfoSMGeneral: ({ extensionInitialized, extensionPresent }) => {
    return {
      extensionInitialized,
      extensionPresent,
    };
  },
  actionsSMGeneral: state => {
    return state.actions;
  },
  pendingActionSMGeneral: ({ pendingAction }) => pendingAction,
  generalLoadingSMGeneral: ({ generalLoading }) => generalLoading,
  apiConnectionValidSMGeneral: ({ apiConnectionValid }) => apiConnectionValid,
};
