import { useStore } from '@/store';
import { computed } from 'vue';
import * as constants from '@/variables/constants';
import { useRouter } from 'vue-router';

const { getters, commit } = useStore();

export const onRouteHashChangeWatch = (newVal: any, oldVal: any): void => { // eslint-disable-line
  // eslint-disable-line
  const liquidityProperties = computed(() => getters.liquidityPropertiesSMSinglePool);

  if (newVal.length === 0 && newVal === oldVal) return;

  const liquidityPropsTpl: LiquidityProperties = {
    asset1: null,
    asset2: null,
    actionType: '',
  };

  if (!newVal && oldVal.length > 0) {
    commit('SET_LIQUIDITY_PROPERTIES__SINGLE_POOL', liquidityPropsTpl);
    commit('SET_ADD_REMOVE_POOL_LIQUIDITY_DIALOG__SINGLE_POOL', false);
    return;
  }

  liquidityPropsTpl.asset1 = liquidityProperties.value.asset1;
  liquidityPropsTpl.asset2 = liquidityProperties.value.asset2;

  switch (newVal.replace('#', '')) {
    case constants.POOL_ADD_LIQUIDITY_SECTION_PATH:
      commit('SET_LIQUIDITY_PROPERTIES__SINGLE_POOL', {
        ...liquidityPropsTpl,
        actionType: 'add',
      });
      commit('SET_ADD_REMOVE_POOL_LIQUIDITY_DIALOG__SINGLE_POOL', true);
      return;
    case constants.POOL_REMOVE_LIQUIDITY_SECTION_PATH:
      commit('SET_LIQUIDITY_PROPERTIES__SINGLE_POOL', {
        ...liquidityPropsTpl,
        actionType: 'withdraw',
      });
      commit('SET_ADD_REMOVE_POOL_LIQUIDITY_DIALOG__SINGLE_POOL', true);
      return;
  }
};

export const onMountRouteHashCheck = (): void => {
  const router = useRouter();

  const currentRouteHash = router.currentRoute.value.hash;

  if (currentRouteHash.length === 0) return;

  const liquidityProperties = computed(() => getters.liquidityPropertiesSMSinglePool);

  const liquidityPropsTpl: LiquidityProperties = {
    asset1: liquidityProperties.value.asset1,
    asset2: liquidityProperties.value.asset2,
    actionType: '',
  };

  switch (currentRouteHash.replace('#', '')) {
    case constants.POOL_ADD_LIQUIDITY_SECTION_PATH:
      commit('SET_LIQUIDITY_PROPERTIES__SINGLE_POOL', {
        ...liquidityPropsTpl,
        actionType: 'add',
      });
      commit('SET_ADD_REMOVE_POOL_LIQUIDITY_DIALOG__SINGLE_POOL', true);
      return;
    case constants.POOL_REMOVE_LIQUIDITY_SECTION_PATH:
      commit('SET_LIQUIDITY_PROPERTIES__SINGLE_POOL', {
        ...liquidityPropsTpl,
        actionType: 'withdraw',
      });
      commit('SET_ADD_REMOVE_POOL_LIQUIDITY_DIALOG__SINGLE_POOL', true);
      return;
  }
};
