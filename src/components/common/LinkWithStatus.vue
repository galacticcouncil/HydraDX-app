<template>
  <router-link v-if="!externalSrc" :to="to" :class="linkClass">
    <slot />
  </router-link>
  <a
    v-else
    :target="newContext ? '_blank' : '_self'"
    :href="to"
    :class="linkClass"
    ><slot
  /></a>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'LinkWithStatus',
  props: {
    manualStatus: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
    externalSrc: {
      type: Boolean,
      default: false,
    },
    to: {
      type: String,
      default: '/',
    },
    customClass: {
      type: String,
      default: '',
    },
    newContext: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const router = useRouter();

    const isActiveLink = computed(() => {
      let isActive = false;

      if (
        !props.manualStatus &&
        router.currentRoute.value.fullPath === props.to
      ) {
        isActive = true;
      } else if (props.manualStatus && props.active) {
        isActive = true;
      }

      return isActive;
    });

    return {
      isActiveLink,
      linkClass: computed(
        () =>
          `hdx-link-with-status ${isActiveLink.value ? 'active' : ''} ${
            props.customClass
          }`
      ),
    };
  },
});
</script>

<style scoped></style>
