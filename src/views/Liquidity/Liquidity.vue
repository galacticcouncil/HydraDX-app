<template>
  <div class="page-wrapper liquidity">
    <PoolsList v-show="!isPoolSelected && !createPoolDialogOpen" />
<!--    <SinglePoolPanel v-show="isPoolSelected && !createPoolDialogOpen" />-->
    <CreatePoolPanel v-if="createPoolDialogOpen" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onBeforeUnmount } from 'vue';
import { useStore } from '@/store';
import PoolsList from '@/components/liquidity/PoolsList.vue';
import SinglePoolPanel from '@/components/liquidity/SinglePoolPanel.vue';
import CreatePoolPanel from '@/components/liquidity/CreatePoolPanel.vue';

export default defineComponent({
  name: 'Liquidity',
  components: { PoolsList, SinglePoolPanel, CreatePoolPanel },
  setup() {
    const { getters, commit, dispatch } = useStore();

    onBeforeUnmount(() => {
      commit('SET_CREATE_POOL_DIALOG_OPEN__POOL', false);
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

    return {
      isPoolSelected,
      createPoolDialogOpen: computed(() => getters.createPoolDialogOpenSMPool),
    };
  },
});
</script>

<style scoped>
</style>
