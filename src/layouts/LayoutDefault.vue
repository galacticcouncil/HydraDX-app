<template>
  <div class="layout-default" :class="{ 'pending-action': pendingAction }">
    <Header />
    <slot />
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
