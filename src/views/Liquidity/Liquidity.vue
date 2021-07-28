<template>
  <div class="page-wrapper liquidity">
    <PagePanelLayout>
      <PoolsList v-show="!isPoolSelected" />
      <CreatePoolDialog />
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
import CreatePoolDialog from '@/components/liquidity/CreatePoolDialog.vue';
import {
  onRouteHashChangeWatchLiquidityPage,
  onMountRouteHashCheckLiquidityPage,
} from '@/services/componentsServices/liquidityPage';
import { useRouter } from 'vue-router';
import { tryConnectPolkadotDapp } from '@/services/componentsServices/commonComponentsServices';

export default defineComponent({
  name: 'Liquidity',
  components: { PoolsList, CreatePoolDialog },
  setup() {
    const { getters, commit } = useStore();
    const router = useRouter();

    onBeforeUnmount(() => {
      commit('SET_CREATE_POOL_DIALOG_OPEN__SINGLE_POOL', false);
    });

    onMounted(() => {
      tryConnectPolkadotDapp();
      onMountRouteHashCheckLiquidityPage();
    });

    const selectedPool = computed(() => getters.selectedPoolSMSinglePool);
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

    watch(
      () => router.currentRoute.value.hash,
      onRouteHashChangeWatchLiquidityPage
    );

    return {
      isPoolSelected,
      createPoolDialogOpen: computed(
        () => getters.createPoolDialogOpenSMSinglePool
      ),
    };
  },
});
</script>

<style scoped></style>
