import { useStore } from '@/store';
import { computed } from 'vue';
import BigNumber from 'bignumber.js';
import * as constants from '@/variables/constants';
import { useRouter } from 'vue-router';

const { getters, dispatch, commit } = useStore();

export const onRouteHashChangeWatch = (newVal: any, oldVal: any): void => {
  const liquidityProperties = computed(() => getters.liquidityPropertiesSMPool);

  if (newVal.length === 0 && newVal === oldVal) return;

  const liquidityPropsTpl: LiquidityProperties = {
    asset1: null,
    asset2: null,
    actionType: '',
  };

  if (!newVal && oldVal.length > 0) {
    console.log(0);
    commit('SET_LIQUIDITY_PROPERTIES__POOL', liquidityPropsTpl);
    commit('SET_ADD_REMOVE_POOL_LIQUIDITY_DIALOG__POOL', false);
    return;
  }

  liquidityPropsTpl.asset1 = liquidityProperties.value.asset1;
  liquidityPropsTpl.asset2 = liquidityProperties.value.asset2;
  console.log(1);

  switch (newVal.replace('#', '')) {
    case constants.POOL_ADD_LIQUIDITY_SECTION_PATH:
      console.log(2);
      console.log(liquidityPropsTpl);
      commit('SET_LIQUIDITY_PROPERTIES__POOL', {
        ...liquidityPropsTpl,
        actionType: 'add',
      });
      commit('SET_ADD_REMOVE_POOL_LIQUIDITY_DIALOG__POOL', true);
      return;
    case constants.POOL_REMOVE_LIQUIDITY_SECTION_PATH:
      console.log(3);
      console.log(liquidityPropsTpl);
      commit('SET_LIQUIDITY_PROPERTIES__POOL', {
        ...liquidityPropsTpl,
        actionType: 'withdraw',
      });
      commit('SET_ADD_REMOVE_POOL_LIQUIDITY_DIALOG__POOL', true);
      return;
  }
};

export const onMountRouteHashCheck = () => {
  const router = useRouter();

  const currentRouteHash = router.currentRoute.value.hash;

  if (currentRouteHash.length === 0) return;

  const liquidityProperties = computed(() => getters.liquidityPropertiesSMPool);

  const liquidityPropsTpl: LiquidityProperties = {
    asset1: liquidityProperties.value.asset1,
    asset2: liquidityProperties.value.asset2,
    actionType: '',
  };

  switch (currentRouteHash.replace('#', '')) {
    case constants.POOL_ADD_LIQUIDITY_SECTION_PATH:
      console.log(2);
      console.log(liquidityPropsTpl);
      commit('SET_LIQUIDITY_PROPERTIES__POOL', {
        ...liquidityPropsTpl,
        actionType: 'add',
      });
      commit('SET_ADD_REMOVE_POOL_LIQUIDITY_DIALOG__POOL', true);
      return;
    case constants.POOL_REMOVE_LIQUIDITY_SECTION_PATH:
      console.log(3);
      console.log(liquidityPropsTpl);
      commit('SET_LIQUIDITY_PROPERTIES__POOL', {
        ...liquidityPropsTpl,
        actionType: 'withdraw',
      });
      commit('SET_ADD_REMOVE_POOL_LIQUIDITY_DIALOG__POOL', true);
      return;
  }
};
