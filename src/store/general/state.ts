const savedScreen = localStorage.getItem('screen');

export const state: GeneralState = {
  blockHash: null,
  blockNumber: 0,

  allowedGenesisHashes: [
    '0x0ed32bfcab4a83517fac88f2aa7cbc2f88d3ab93be9a12b6188a036bf8a943c2',
    '0xd2a620c27ec5cbc5621ff9a522689895074f7cca0d08e7134a7804e1a3ba86fc',
    '0x10af6e84234477d84dc572bac0789813b254aa490767ed06fb9591191d1073f9',
  ],
  genesisHash: null,
  chainAddressFormat: null,

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
