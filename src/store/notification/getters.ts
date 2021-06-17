import { GetterTree } from 'vuex';

export const getters: GetterTree<NotificationState, MergedState> &
  NotificationGetters = {
  generalLoadingSMNotification: ({ generalLoading }) => generalLoading,
  generalLoadingSpinnerSMNotification: ({ generalLoadingSpinner }) => generalLoadingSpinner,
  generalLoadingShowReconnectControlSMNotification: ({ generalLoadingShowReconnectControl }) =>
    generalLoadingShowReconnectControl,
  generalLoadingMessagesSMNotification: ({ generalLoadingMessages }) =>
    generalLoadingMessages,
};
