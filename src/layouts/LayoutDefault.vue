<template>
  <div class="layout-default" :class="{ 'pending-action': pendingAction }">
    <div class="layout-outer-container">
      <div class="layout-inner-container">
        <div class="layout-bgr-image"></div>
        <Header />
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/common/Header.vue';
import { defineComponent, computed } from 'vue';
import { useStore } from '@/store';

export default defineComponent({
  name: 'LayoutDefault',
  components: {
    Header,
  },
  setup() {
    const { getters } = useStore();

    return {
      pendingAction: computed(() => getters.pendingActionSMGeneral),
    };
  },
});
</script>

<style scoped></style>
