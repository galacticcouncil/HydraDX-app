import { MutationTree } from 'vuex';

export const mutations: MutationTree<GeneralState> & GeneralMutations = {
  SET_PENDING_ACTION__GENERAL(state, pending) {
    state.pendingAction = pending;
  },
  SET_GENESIS_HASH__GENERAL(state, genesisHash) {
    state.genesisHash = genesisHash;
  },
  SET_CHAIN_ADDRESS_FORMAT__GENERAL(state, addressFormat) {
    state.chainAddressFormat = addressFormat;
  },
  SET_API_CONNECTION_VALID__GENERAL(state, status) {
    state.apiConnectionValid = status;
  },
  SET_BLOCK_HASH__GENERAL(state, payload) {
    state.blockHash = payload;
  },
  SET_BLOCK_NUMBER__GENERAL(state, payload) {
    state.blockNumber = payload;
  },
  SET_BLOCK_INFO__GENERAL(state, { blockNumber, blockHash }) {
    state.blockNumber = blockNumber;
    state.blockHash = blockHash;
  },
  SET_EXTENSION_PRESENT__GENERAL(state, extensionPresent) {
    state.extensionPresent = extensionPresent;
  },
  SET_EXTENSION_INITIALIZED__GENERAL(state, extensionInitialized) {
    state.extensionInitialized = extensionInitialized;
  },
  SET_SCREEN__GENERAL(state, screen) {
    localStorage.setItem('screen', screen);
    state.currentScreen = screen;
  },
  ADD_ACTION__GENERAL(state, actions) {
    state.actions = [...state.actions, ...actions];
  },
  CLEAR_ACTION__GENERAL(state, actionsForRemove) {
    state.actions = state.actions.filter(
      item => !actionsForRemove.includes(item)
    );
  },
};
