<template>
  <button :disabled="disabled" @click="clickHandler" :class="linkClass">
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'ButtonCommon',
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
      default: () => {},
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
    medium: {
      type: Boolean,
      default: false,
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
          `hdx-button-common ${props.small ? 'btn-small' : ''} ${props.medium ? 'btn-medium' : ''} ${
            props.customClass
          }`
      ),
    };
  },
});
</script>

<style scoped></style>
