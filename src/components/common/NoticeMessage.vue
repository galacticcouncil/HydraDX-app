<template>
  <div
    class="hdx-notice-message"
    :class="{ error: error, info: info, customClass: customClass.length > 0 }"
  >
    <div class="notice-content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NoticeMessage',
  props: {
    error: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Boolean,
      default: false,
    },
    customClass: {
      type: String,
      default: '',
    },
  },
});
</script>

<style scoped></style>
