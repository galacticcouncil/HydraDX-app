import { GetterTree } from 'vuex';
import { IRootGettersTypes, IRootState } from '@/store/interfaces';

export const getters: GetterTree<IRootState, IRootState> & IRootGettersTypes = {
  getBlockHash: (state: IRootState) => {
    return state.blockHash;
  },
  getBlockNumber: (state: IRootState) => {
    return state.blockNumber;
  },
  blockInfo: ({ blockNumber, blockHash }: IRootState) => {
    return {
      blockNumber,
      blockHash,
    };
  },
  currentScreen: (state: IRootState) => {
    return state.currentScreen;
  },
  extensionInfo: ({ extensionInitialized, extensionPresent }: IRootState) => {
    return {
      extensionInitialized,
      extensionPresent,
    };
  },
};
