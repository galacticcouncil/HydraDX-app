<template>
  <div class="page-wrapper liquidity single-pool">
    <PagePanelLayout class="hdx-single-pool">
      <SinglePoolPanel />
    </PagePanelLayout>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  ref,
} from 'vue';
import { useStore } from '@/store';
import SinglePoolPanel from '@/components/liquidity/SinglePoolPanel.vue';
import { useRouter, RouteParams } from 'vue-router';
import { Ref } from '@vue/reactivity';
import * as constants from '@/variables/constants';

import { onRouteHashChangeWatch, onMountRouteHashCheck } from '@/services/componentsServices/singlePool';

export default defineComponent({
  name: 'SinglePool',
  components: { SinglePoolPanel },
  setup() {
    const { getters, commit, dispatch } = useStore();
    const router = useRouter();
    const currentPoolId: Ref<string | null> = ref(null);

    const selectedPool = computed(() => getters.selectedPoolSMPool);
    const poolInfo = computed(() => getters.poolInfoSMPool);

    const liquidityProperties = computed(
      () => getters.liquidityPropertiesSMPool
    );

    const isPoolSelected = computed(() => {
      return (
        selectedPool.value !== null &&
        liquidityProperties.value.asset1 !== null &&
        liquidityProperties.value.asset2 !== null
      );
    });

    const setCurrentPool = () => {
      if (currentPoolId.value === null || !poolInfo.value[currentPoolId.value])
        return;

      const asset1 = poolInfo.value[currentPoolId.value].poolAssets[0];
      const asset2 = poolInfo.value[currentPoolId.value].poolAssets[1];
      commit('SET_LIQUIDITY_PROPERTIES__POOL', {
        actionType: liquidityProperties.value.actionType,
        asset1,
        asset2,
      });
      dispatch('getSpotPriceSMTrade');
      dispatch('changeSelectedPoolSMPool', currentPoolId.value);
    };

    watch(
      () => getters.poolInfoSMPool,
      (nawVal, oldVal) => {
        if (
          nawVal &&
          currentPoolId.value !== null &&
          nawVal[currentPoolId.value] !== undefined &&
          oldVal[currentPoolId.value] === undefined
        ) {
          setCurrentPool();
        }
      }
    );
    watch(() => router.currentRoute.value.hash, onRouteHashChangeWatch);

    onMounted(() => {
      onMountRouteHashCheck();
      if (
        !selectedPool.value &&
        router.currentRoute.value.params.id !== undefined
      ) {
        currentPoolId.value = router.currentRoute.value.params.id as string;
        setCurrentPool();
      }
    });
    onBeforeUnmount(() => {
      commit('SET_LIQUIDITY_PROPERTIES__POOL', {
        actionType: '',
        asset1: null,
        asset2: null,
      });
      dispatch('changeSelectedPoolSMPool', null);
    });

    return {
      isPoolSelected,
      createPoolDialogOpen: computed(() => getters.createPoolDialogOpenSMPool),
    };
  },
});
</script>

<style scoped></style>
