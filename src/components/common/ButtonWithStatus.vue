<template>
  <button @click="clickHandler" :class="linkClass">
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'ButtonWithStatus',
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    prevent: {
      type: Boolean,
      default: true,
    },
    customClass: {
      type: String,
      default: '',
    },
    onClick: {
      type: Function,
      default: () => {
        return;
      },
    },
  },
  setup(props) {
    const clickHandler = (e: Event) => {
      if (props.prevent) e.preventDefault();
      props.onClick();
    };
    return {
      clickHandler,
      linkClass: computed(
        () =>
          `hdx-button-with-status ${props.active ? 'active' : ''} ${
            props.customClass
          }`
      ),
    };
  },
});
</script>

<style scoped></style>
