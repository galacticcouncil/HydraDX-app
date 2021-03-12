const savedScreen = localStorage.getItem('screen');

export const state: GeneralState = {
  blockHash: null,
  blockNumber: 0,

  extensionInitialized: false,
  extensionPresent: true,
  apiConnectionValid: false,

  currentScreen: savedScreen ? savedScreen : 'initial',
  savedScreen: !!savedScreen,
  actions: [],
  pendingAction: false,

  generalLoading: true,
  generalLoadingMessages: [],
};
