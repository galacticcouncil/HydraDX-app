import { createStore } from 'vuex';
import { IRootState } from '@/store/interfaces';

import { WalletStoreModuleTypes } from '@/store/modules/wallet/types';
import { RootStoreModuleTypes } from '@/store/modules/root/types';

import root from '@/store/modules/root';

export const store = createStore<IRootState>(root);

type StoreModules = {
  wallet: WalletStoreModuleTypes;
  root: RootStoreModuleTypes;
};

export type Store = WalletStoreModuleTypes<Pick<StoreModules, 'wallet'>> &
  RootStoreModuleTypes<Pick<StoreModules, 'root'>>;
