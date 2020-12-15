import { MutationTypes as walletTypes } from './modules/wallet/mutation-types';
import { MutationTypes as rootTypes } from './modules/root/mutation-types';

export const AllMutationTypes = { ...walletTypes, ...rootTypes };
