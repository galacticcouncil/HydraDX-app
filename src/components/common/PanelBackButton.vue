<template>
  <a href="#" class="panel-back-button" @click.prevent="onClick">
    <img :src="backBtnIcon" alt="Back" />
  </a>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import { useStore } from '@/store';

export default defineComponent({
  name: 'PanelBackButton',
  props: {
    onClick: {
      type: Function,
      default: () => {
        return;
      },
    },
  },
  setup() {
    return {
      backBtnIcon: require('@/assets/images/reply.svg'),
    };
  },
});
</script>

<style scoped></style>
