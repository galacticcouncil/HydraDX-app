import { GetterTree } from 'vuex';

export const getters: GetterTree<GeneralState, MergedState> & GeneralGetters = {
  getBlockHash: state => {
    return state.blockHash;
  },
  getBlockNumber: state => {
    return state.blockNumber;
  },
  blockInfo: ({ blockNumber, blockHash }) => {
    return {
      blockNumber,
      blockHash,
    };
  },
  currentScreen: state => {
    return state.currentScreen;
  },
  extensionInfo: ({ extensionInitialized, extensionPresent }) => {
    return {
      extensionInitialized,
      extensionPresent,
    };
  },
};
