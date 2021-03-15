import { Module } from 'vuex';

import { state } from '@/store/trade/state';
import { mutations } from '@/store/trade/mutations';
import { actions } from '@/store/trade/actions';
import { getters } from '@/store/trade/getters';

export const trade: Module<TradeState, MergedState> = {
  state,
  mutations,
  actions,
  getters,
};
