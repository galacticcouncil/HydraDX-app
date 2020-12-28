import { Module } from 'vuex';

import { state } from '@/store/trade/state.ts';
import { mutations } from '@/store/trade/mutations.ts';
import { actions } from '@/store/trade/actions.ts';
import { getters } from '@/store/trade/getters.ts';

export const trade: Module<TradeState, MergedState> = {
  // namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
