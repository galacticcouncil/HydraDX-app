import { useToast } from 'vue-toastification';
import { useStore } from '@/store';

import { TRANSACTION_NOTIFICATION } from '@/variables/notifications';
import { CHAIN_METHOD } from '@/variables/constants';

export const handleTransactionError = (error: any) => {
  // eslint-disable-line
  const toast = useToast();
  const { commit } = useStore();

  if (error && error.data && error.data === 'Cancelled') {
    commit('SET_PENDING_ACTION__GENERAL', false);
    toast.info(TRANSACTION_NOTIFICATION.transactionCancelled);
  } else if (error && error.data && error.type) {
    switch (error.type) {
      case 'Error':
        toast.error(error.data);
        break;
      case CHAIN_METHOD.extrinsicFailed:
        if (Array.isArray(error.data)) {
          error.data.forEach((errorItem: any) => {
            toast.error(errorItem.documentation);
          });
        } else {
          toast.error(error.data);
        }
        break;
    }
    // commit('UPDATE_TRANSACTIONS__TRADE', {
    //   index: 1,
    //   progress: 5,
    // });
  }
};

export const handleTransactionSuccess = (resp: any): void => {
  const toast = useToast();

  if (!resp || !resp.data) return;

  if (Array.isArray(resp.data)) {
    resp.data.forEach((respDataItem: any) => {
      if (respDataItem.method === CHAIN_METHOD.extrinsicSuccess) {
        toast.success(TRANSACTION_NOTIFICATION.transactionSuccessfulCommon);
      }
    });
  }
};
