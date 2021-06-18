import { createStore, ModuleTree } from 'vuex'; //createLogger

import { general } from '@/store/general';
import { wallet } from '@/store/wallet';
import { pool } from '@/store/pool';
import { trade } from '@/store/trade';
import { notification } from '@/store/notification';

const modules: ModuleTree<MergedState> = {
  general,
  wallet,
  pool,
  trade,
  notification,
};

export const store = createStore({
  // plugins: process.env.NODE_ENV === 'production' ? [] : [createLogger()],
  modules,
});

export function useStore(): RootStore {
  return store as RootStore;
}

export default store;
