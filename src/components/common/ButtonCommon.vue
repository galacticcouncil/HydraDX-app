<template>
  <button :disabled="disabledStatus" @click="clickHandler" :class="linkClass">
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from '@/store';
const { getters, commit, dispatch } = useStore();

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
    pdDappRequired: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const extensionInfo = computed(() => getters.extensionInfoSMGeneral);

    const disabledStatus = computed(() => {
      return (
        props.disabled ||
        (props.pdDappRequired && !extensionInfo.value.extensionInitialized) ||
        (props.pdDappRequired && !extensionInfo.value.accountSelected)
      );
    });

    const clickHandler = (e: Event) => {
      if (props.prevent) e.preventDefault();
      if (disabledStatus.value) return;
      props.onClick();
    };
    return {
      clickHandler,
      extensionInfo,
      disabledStatus,
      linkClass: computed(
        () =>
          `hdx-button-common ${props.small ? 'btn-small' : ''} ${
            props.medium ? 'btn-medium' : ''
          } ${props.customClass}`
      ),
    };
  },
});
</script>

<style scoped></style>
