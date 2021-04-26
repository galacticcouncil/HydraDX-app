<template>
  <div class="page-wrapper liquidity">
    <PagePanelLayout>
      <PoolsList v-show="!isPoolSelected && !createPoolDialogOpen" />
      <CreatePoolPanel v-if="createPoolDialogOpen" />
    </PagePanelLayout>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  onBeforeUnmount,
  onMounted,
  watch,
} from 'vue';
import { useStore } from '@/store';
import PoolsList from '@/components/liquidity/PoolsList.vue';
import CreatePoolPanel from '@/components/liquidity/CreatePoolPanel.vue';
import {
  onRouteHashChangeWatchLiquidityPage,
  onMountRouteHashCheckLiquidityPage,
} from '@/services/componentsServices/liquidityPage';
import { useRouter } from 'vue-router';
import { tryConnectPolkadotDapp } from '@/services/componentsServices/commonComponentsServices';

export default defineComponent({
  name: 'Liquidity',
  components: { PoolsList, CreatePoolPanel },
  setup() {
    const { getters, commit } = useStore();
    const router = useRouter();

    onBeforeUnmount(() => {
      commit('SET_CREATE_POOL_DIALOG_OPEN__POOL', false);
    });

    onMounted(() => {
      tryConnectPolkadotDapp();
      onMountRouteHashCheckLiquidityPage();
    });

    const selectedPool = computed(() => getters.selectedPoolSMPool);
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

    watch(
      () => router.currentRoute.value.hash,
      onRouteHashChangeWatchLiquidityPage
    );

    return {
      isPoolSelected,
      createPoolDialogOpen: computed(() => getters.createPoolDialogOpenSMPool),
    };
  },
});
</script>

<style scoped></style>
