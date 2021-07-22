<template>
  <ModalCommon
    :open="createPoolDialogOpen"
    name="create-pool"
    :on-close-click="closeCreatePoolDialog"
  >
    <div class="hdx-common-panels-container">
      <CreatePoolControlsPanel />
    </div>
  </ModalCommon>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import CreatePoolControlsPanel from '@/components/liquidity/CreatePoolControlsPanel.vue';
import PanelBackButton from '@/components/common/PanelBackButton.vue';
import ModalCommon from '@/components/common/ModalCommon.vue';
import { useStore } from '@/store';

export default defineComponent({
  name: 'CreatePoolDialog',
  components: {
    PanelBackButton,
    CreatePoolControlsPanel,
    ModalCommon,
  },
  setup() {
    const router = useRouter();
    const { getters } = useStore();

    return {
      closeCreatePoolDialog: () => router.push(router.currentRoute.value.path),
      createPoolDialogOpen: computed(
        () => getters.createPoolDialogOpenSMSinglePool
      ),
    };
  },
});
</script>

<style scoped></style>
