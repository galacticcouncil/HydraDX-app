import { MutationTree } from "vuex";
import { MutationTypes } from "./mutation-types";
import { RootMutationsTypes, IRootState } from "./../../interfaces";

export const mutations: MutationTree<IRootState> & RootMutationsTypes = {
  [MutationTypes.SET_BLOCK_HASH](state: IRootState, payload: string | null) {
    state.blockHash = payload;
  },
  [MutationTypes.SET_BLOCK_NUMBER](state: IRootState, payload: number) {
    state.blockNumber = payload;
  }
};
