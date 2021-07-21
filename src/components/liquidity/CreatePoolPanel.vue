<template>
  <div class="hdx-create-pool">
    <div class="hdx-page-screen-panel-container hdx-create-pool-panel">
      <div class="screen-panel-body">
        <PanelBackButton :on-click="closeCreatePoolDialog" />
        <div class="hdx-common-panels-container built-in-panels">
          <CreatePoolControlsPanel />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import CreatePoolControlsPanel from '@/components/liquidity/CreatePoolControlsPanel.vue';
import PanelBackButton from '@/components/common/PanelBackButton.vue';

export default defineComponent({
  name: 'CreatePoolPanel',
  components: {
    PanelBackButton,
    CreatePoolControlsPanel,
  },
  setup() {
    const router = useRouter();

    return {
      closeCreatePoolDialog: () => router.push(router.currentRoute.value.path),
    };
  },
});
</script>

<style scoped></style>
