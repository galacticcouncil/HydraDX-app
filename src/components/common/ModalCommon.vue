<template>
  <div :class="['hdx-common-modal', `${name}-modal`]">
    <div v-if="open" class="hdx-common-modal-container">
      <div
        class="hdx-common-modal-content"
        :class="{ 'with-body-panel': withBodyPanel }"
      >
        <PanelBackButton
          class="modal-close-button"
          v-if="!disableCloseBtn"
          :on-click="onCloseClick"
        />
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PanelBackButton from '@/components/common/PanelBackButton.vue';

export default defineComponent({
  name: 'ModalCommon',
  components: {
    PanelBackButton,
  },
  props: {
    name: {
      type: String,
      default: '',
    },
    open: {
      type: Boolean,
      default: false,
    },
    withBodyPanel: {
      type: Boolean,
      default: false,
    },
    disableCloseBtn: {
      type: Boolean,
      default: false,
    },
    onCloseClick: {
      type: Function,
      default: () => {
        return;
      },
    },
  },
});
</script>