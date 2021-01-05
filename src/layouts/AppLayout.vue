<template>
  <div>
    <component :is="layout">
      <slot />
    </component>
  </div>
</template>

<script>
import LayoutInitial from '@/layouts/LayoutInitial';

// import { shallowReactive, watch } from 'vue';
// import { useRoute } from 'vue-router';

export default {
  name: 'AppLayout',
  // setup() {
  //   const route = useRoute();
  //   const layout = shallowReactive(LayoutDefault);
  //
  //   console.log(1);
  //   console.log('route - ', route);
  //
  //   watch(
  //     () => route.meta,
  //     async newRouteMeta => {
  //       console.log('newRoute - ', newRouteMeta);
  //       console.log('LayoutDefault - ', LayoutDefault);
  //
  //       try {
  //         const component = await import(
  //           `@/layouts/${newRouteMeta.layout}.vue`
  //         );
  //         console.log('component - ', component);
  //         layout.value = component?.default || LayoutDefault;
  //       } catch (e) {
  //         layout.value = LayoutDefault;
  //       }
  //     },
  //     { immediate: true }
  //   );
  //
  //   return { layout };
  //   // return () => h(layout);
  // },
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
};
</script>
