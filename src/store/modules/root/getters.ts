import { GetterTree } from 'vuex';
import { IRootGettersTypes, IRootState } from './../../interfaces';

export const getters: GetterTree<IRootState, IRootState> & IRootGettersTypes = {
  getBlockHash: (state: IRootState): string | null => {
    return state.blockHash;
  },
  getBlockNumber: (state: IRootState): number => {
    return state.blockNumber;
  },
};
