<template>
  <div>
    <component :is="layout">
      <slot />
    </component>
  </div>
</template>

<script>
import LayoutInitial from '@/layouts/LayoutInitial';

import { defineComponent, ref, computed, onMounted } from 'vue';
import { useStore } from '@/store';

export default defineComponent({
  name: 'AppLayout',
  setup() {
    const { dispatch } = useStore();

    onMounted(() => {
      dispatch('initializeApiSMGeneral');
    });
  },
  data() {
    return {
      layout: LayoutInitial,
    };
  },
  watch: {
    $route: {
      immediate: true,
      async handler(route) {
        try {
          const component = await import(`@/layouts/${route.meta.layout}.vue`);
          this.layout = component?.default || LayoutInitial;
        } catch (e) {
          this.layout = LayoutInitial;
        }
      },
    },
  },
});
</script>
