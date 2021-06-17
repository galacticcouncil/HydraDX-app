<template>
  <div class="hdx-page-panel-layout">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PagePanelLayout',
});
</script>
