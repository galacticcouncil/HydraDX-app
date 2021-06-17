<template>
  <div v-if="layout">
    <component :is="layout">
      <slot />
      <GeneralLoadingCover v-show="generalLoading" />
    </component>
  </div>
</template>

<script>
import LayoutInitial from '@/layouts/LayoutInitial';
import GeneralLoadingCover from '@/components/common/GeneralLoadingCover';

import { defineComponent, computed, onMounted, markRaw } from 'vue';
import { useStore } from '@/store';

import notificationsVars from '@/variables/notifications';

export default defineComponent({
  name: 'AppLayout',
  components: {
    GeneralLoadingCover,
  },
  setup() {
    const { getters, dispatch, commit } = useStore();

    onMounted(() => {
      setTimeout(() => {
        commit('SET_GENERAL_LOADING__NOTIFICATION', true);
        commit('SET_GENERAL_LOADING_MESSAGES__NOTIFICATION', {
          action: 'add',
          message: notificationsVars.loadingMsgApiConnection,
        });
        dispatch('initializeApiSMGeneral');
      });
    });

    return {
      generalLoading: computed(() => getters.generalLoadingSMNotification),
    };
  },
  data() {
    return {
      layout: null,
    };
  },
  /**
   * There is one bad effect of such approach for changing layouts - when user
   * changes pages/routes and these pages use 2 different layouts, destination
   * page component will be mounted twice (hook mounted/onMounted will be
   * executed 2 times). It's happening because app is running by next steps:
   *  1) Page 1 is loaded and mounted with Layout 1;
   *  2) User/app logic changes route to the Page 2 with Layout 2;
   *  3) Route changes and Page 2 mounts to the Layout 1 (because current
   * selected layout is still Layout 1);
   *  4) After changing of current route, watch hook to "$route" executes and
   * current layout changes from Layout 1 to Layout 2 (regarding
   * "route.meta.layout");
   *  5) Component of Page 2 re-renders again because it's wrapper component
   * (Layout) has been changed and re-rendered with all it's content (Page2);
   */
  watch: {
    $route: {
      // immediate: true,
      async handler(route) {
        try {
          const component = await import(`@/layouts/${route.meta.layout}.vue`);
          this.layout = markRaw(component?.default || LayoutInitial);
        } catch (e) {
          this.layout = LayoutInitial;
        }
      },
    },
  },
});
</script>
