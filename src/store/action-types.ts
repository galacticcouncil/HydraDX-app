import { ActionTypes as walletTypes } from './modules/wallet/action-types';
import { ActionTypes as rootATypes } from './modules/root/action-types';

export const AllActionTypes = {
  ...walletTypes,
  ...rootATypes,
};
