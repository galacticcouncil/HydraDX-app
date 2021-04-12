<template>
  <div class="hdx-create-pool hdx-common-panel-layout">
    <div class="hdx-page-screen-panel-container hdx-create-pool-panel">
      <div class="screen-panel-header">
        <PanelBackButton :on-click="closeCreatePoolDialog" />
        <div class="create-pool-title">Create new pool</div>
      </div>
      <div class="screen-panel-body">
        <div class="hdx-common-panels-container built-in-panels">
          <CreatePoolControlsPanel />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
type PoolInfo = {
  poolAssets: string[];
  poolAssetNames: string[];
  shareToken: number;
};
import { Ref } from '@vue/reactivity';
import { defineComponent, computed, watch, ref } from 'vue';
import { useStore } from '@/store';
import CreatePoolControlsPanel from '@/components/liquidity/CreatePoolControlsPanel.vue';
import PanelBackButton from '@/components/common/PanelBackButton.vue';

export default defineComponent({
  name: 'CreatePoolPanel',
  components: {
    PanelBackButton,
    CreatePoolControlsPanel,
  },
  setup() {
    const { getters, commit, dispatch } = useStore();

    return {
      closeCreatePoolDialog: () =>
        commit('SET_CREATE_POOL_DIALOG_OPEN__POOL', false),
    };
  },
});
</script>

<style scoped></style>
