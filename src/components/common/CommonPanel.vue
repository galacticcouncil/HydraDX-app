<template>
  <div class="hdx-common-panel-container">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import { useStore } from '@/store';

export default defineComponent({
  name: 'CommonPanel',
  // setup() {
  //   const { getters } = useStore();
  //
  //   return {
  //     messages: computed(() => getters.generalLoadingMessagesSMGeneral),
  //   };
  // },
});
</script>

<style scoped></style>
