import { Module } from 'vuex';

import { state } from '@/store/notification/state';
import { mutations } from '@/store/notification/mutations';
import { actions } from '@/store/notification/actions';
import { getters } from '@/store/notification/getters';

export const notification: Module<NotificationState, MergedState> = {
  state,
  mutations,
  actions,
  getters,
};
