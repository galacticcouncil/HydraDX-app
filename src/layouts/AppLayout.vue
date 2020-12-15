<template>
  <component :is="layout">
    <slot />
  </component>
</template>

<script>
import LayoutDefault from './LayoutDefault';

export default {
  name: 'AppLayout',
  data: () => ({
    layout: LayoutDefault,
  }),
  watch: {
    $route: {
      immediate: true,
      async handler(route) {
        try {
          const component = await import(`@/layouts/${route.meta.layout}.vue`);
          this.layout = component?.default || LayoutDefault;
        } catch (e) {
          this.layout = LayoutDefault;
        }
      },
    },
  },
};
</script>
