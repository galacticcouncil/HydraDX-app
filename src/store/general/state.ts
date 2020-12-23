const savedScreen = localStorage.getItem('screen');

export const state: GeneralState = {
  blockHash: null,
  blockNumber: 0,

  currentScreen: savedScreen ? savedScreen : 'initial',
  savedScreen: !!savedScreen,
  extensionInitialized: false,
  extensionPresent: true,
};
