import { useStore } from '@/store';
import BigNumber from 'bignumber.js';
import * as constants from '@/variables/constants';
import { useRouter } from 'vue-router';

const { dispatch, commit } = useStore();

export const onRouteHashChangeWatchLiquidityPage = (
  newVal: any, // eslint-disable-line
  oldVal: any // eslint-disable-line
): void => {
  if (newVal.length === 0 && newVal === oldVal) return;

  if (!newVal && oldVal.length > 0) {
    dispatch('changeNewPoolPropertiesSMPool', {
      asset1: null,
      asset2: null,
      initialPrice: new BigNumber(0),
      amount: new BigNumber(0),
    });
    commit('SET_CREATE_POOL_DIALOG_OPEN__POOL', false);
    return;
  }

  switch (newVal.replace('#', '')) {
    case constants.POOL_CREAT_NEW_POOL_SECTION_PATH:
      commit('SET_CREATE_POOL_DIALOG_OPEN__POOL', true);
      return;
  }
};

export const onMountRouteHashCheckLiquidityPage = (): void => {
  const router = useRouter();

  const currentRouteHash = router.currentRoute.value.hash;

  if (currentRouteHash.length === 0) return;

  switch (currentRouteHash.replace('#', '')) {
    case constants.POOL_CREAT_NEW_POOL_SECTION_PATH:
      commit('SET_CREATE_POOL_DIALOG_OPEN__POOL', true);
      return;
  }
};
