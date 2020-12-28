import { createStore, createLogger, ModuleTree } from 'vuex';

import { general } from '@/store/general';
import { wallet } from '@/store/wallet';
import { pool } from '@/store/pool';
import { trade } from '@/store/trade';

const modules: ModuleTree<MergedState> = { general, wallet, pool, trade };

export const store = createStore({
  plugins: process.env.NODE_ENV === 'production' ? [] : [createLogger()],
  modules,
});

export function useStore(): GeneralStore {
  return store as GeneralStore;
}

export default store;
