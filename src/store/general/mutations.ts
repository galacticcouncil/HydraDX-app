import { MutationTree } from 'vuex';

export const mutations: MutationTree<GeneralState> & GeneralMutations = {
  SET_BLOCK_HASH__GENERAL(state, payload) {
    state.blockHash = payload;
  },
  SET_BLOCK_NUMBER__GENERAL(state, payload) {
    state.blockNumber = payload;
  },
  SET_EXTENSION_PRESENT__GENERAL(state, extensionPresent) {
    state.extensionPresent = extensionPresent;
  },
  SET_EXTENSION_INITIALIZED__GENERAL(state, extensionInitialized) {
    state.extensionInitialized = extensionInitialized;
  },
  SET_SCREEN__GENERAL(state, screen) {
    state.currentScreen = screen;
  },
};
