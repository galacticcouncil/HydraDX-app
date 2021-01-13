<template>
  <div class="layout-initial">
    <slot />
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LayoutInitial',
});
</script>
