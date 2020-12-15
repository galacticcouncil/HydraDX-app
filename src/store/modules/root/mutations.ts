import { MutationTree } from 'vuex';
import { MutationTypes } from '@/store/modules/root/mutation-types';
import { RootMutationsTypes, IRootState } from '@/store/interfaces';

export const mutations: MutationTree<IRootState> & RootMutationsTypes = {
  [MutationTypes.SET_BLOCK_HASH](state: IRootState, payload: string | null) {
    state.blockHash = payload;
  },
  [MutationTypes.SET_BLOCK_NUMBER](state: IRootState, payload: number) {
    state.blockNumber = payload;
  },
  [MutationTypes.SET_EXTENSION_PRESENT](
    state: IRootState,
    extensionPresent: boolean
  ) {
    state.extensionPresent = extensionPresent;
  },
  [MutationTypes.SET_EXTENSION_INITIALIZED](
    state: IRootState,
    extensionInitialized: boolean
  ) {
    state.extensionInitialized = extensionInitialized;
  },
  [MutationTypes.SET_SCREEN](state: IRootState, screen: string) {
    state.currentScreen = screen;
  },
};
