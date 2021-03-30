import { MutationTree } from 'vuex';
import { uniq } from 'lodash';

export const mutations: MutationTree<NotificationState> &
  NotificationMutations = {
  SET_GENERAL_LOADING__NOTIFICATION(state, loading) {
    state.generalLoading = loading;
    if (!loading) {
      state.generalLoadingMessages = [];
      state.generalLoadingShowReconnectControl = false;
      state.generalLoadingSpinner = true;
    }
  },
  SET_GENERAL_LOADING_SHOW_RECONNECT_CONTROL__NOTIFICATION(state, isShow) {
    state.generalLoadingShowReconnectControl = isShow;
  },
  SET_GENERAL_LOADING_SPINNER__NOTIFICATION(state, isShow) {
    state.generalLoadingSpinner = isShow;
  },
  SET_GENERAL_LOADING_MESSAGES__NOTIFICATION(
    state,
    { action = 'add', message = '' }
  ) {
    if (action === 'add') {
      state.generalLoadingMessages = uniq(
        [...state.generalLoadingMessages, message] || []
      );
    } else {
      state.generalLoadingMessages = state.generalLoadingMessages.filter(
        (msg: string) => msg !== message
      );
    }
  },
};
