import {
  WalletStateTypes,
  WalletMutationsTypes,
  WalletGettersTypes,
  WalletActionsTypes,
} from '@/store/interfaces';
import { Store as VuexStore, CommitOptions, DispatchOptions } from 'vuex';

export type WalletStoreModuleTypes<S = WalletStateTypes> = Omit<
  VuexStore<S>,
  'commit' | 'getters' | 'dispatch'
> & {
  commit<
    K extends keyof WalletMutationsTypes,
    P extends Parameters<WalletMutationsTypes[K]>[1]
  >(
    key: K,
    payload?: P,
    options?: CommitOptions
  ): ReturnType<WalletMutationsTypes[K]>;
} & {
  getters: {
    [K in keyof WalletGettersTypes]: ReturnType<WalletGettersTypes[K]>;
  };
} & {
  dispatch<K extends keyof WalletActionsTypes>(
    key: K,
    payload?: Parameters<WalletActionsTypes[K]>[1],
    options?: DispatchOptions
  ): ReturnType<WalletActionsTypes[K]>;
};
