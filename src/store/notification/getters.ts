import { GetterTree } from 'vuex';

export const getters: GetterTree<NotificationState, MergedState> &
  NotificationGetters = {
  generalLoadingSMNotification: ({ generalLoading }) => generalLoading,
  generalLoadingMessagesSMNotification: ({ generalLoadingMessages }) =>
    generalLoadingMessages,
};
