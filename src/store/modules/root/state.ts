import { IRootState } from '@/store/interfaces';

const savedScreen = localStorage.getItem('screen');

export const state: IRootState = {
  blockHash: null,
  blockNumber: 0,

  currentScreen: savedScreen ? savedScreen : 'initial',
  savedScreen: savedScreen ? true : false,
  extensionInitialized: false,
  extensionPresent: true,
};
