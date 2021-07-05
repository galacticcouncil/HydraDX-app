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
import { useRouter } from 'vue-router';
import { Ref } from '@vue/reactivity';

import {
  onRouteHashChangeWatch,
  onMountRouteHashCheck,
} from '@/services/componentsServices/singlePool';

export default defineComponent({
  name: 'SinglePool',
  components: { SinglePoolPanel },
  setup() {
    const { getters, commit, dispatch } = useStore();
    const router = useRouter();
    const currentPoolId: Ref<string | null> = ref(null);

    const selectedPool = computed(() => getters.selectedPoolSMSinglePool);
    const poolsInfo = computed(() => getters.poolsInfoSMPool);

    const liquidityProperties = computed(
      () => getters.liquidityPropertiesSMSinglePool
    );

    const isPoolSelected = computed(() => {
      return (
        selectedPool.value !== null &&
        liquidityProperties.value.asset1 !== null &&
        liquidityProperties.value.asset2 !== null
      );
    });

    const setCurrentPool = () => {
      if (currentPoolId.value === null || !poolsInfo.value[currentPoolId.value])
        return;

      const asset1 = poolsInfo.value[currentPoolId.value].poolAssets[0];
      const asset2 = poolsInfo.value[currentPoolId.value].poolAssets[1];
      commit('SET_LIQUIDITY_PROPERTIES__SINGLE_POOL', {
        actionType: liquidityProperties.value.actionType,
        asset1,
        asset2,
      });
      dispatch('getSpotPriceSMTrade');
      dispatch('changeSelectedPoolSMSinglePool', currentPoolId.value);
    };

    watch(
      () => getters.poolsInfoSMPool,
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
      commit('SET_LIQUIDITY_PROPERTIES__SINGLE_POOL', {
        actionType: '',
        asset1: null,
        asset2: null,
      });
      dispatch('changeSelectedPoolSMSinglePool', null);
    });

    return {
      isPoolSelected,
      createPoolDialogOpen: computed(() => getters.createPoolDialogOpenSMSinglePool),
    };
  },
});
</script>

<style scoped></style>
