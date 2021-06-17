import { useToast } from 'vue-toastification';
import { useStore } from '@/store';

import { transaction as notifications } from '@/variables/notifications';

export const handleTradeTransactionError = (error: any): void => {
  const toast = useToast();
  const { commit } = useStore();

  if (error && error.data && error.data === 'Cancelled') {
    commit('SET_PENDING_ACTION__GENERAL', false);
    toast.info(notifications.transactionCancelled);
  } else if (error && error.data && error.type) {
    if (error.type === 'Error') {
      toast.error(error.data);
    }

    // commit('UPDATE_TRANSACTIONS__TRADE', {
    //   index: 1,
    //   progress: 5,
    // });
  }
};
