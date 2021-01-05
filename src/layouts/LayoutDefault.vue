<template>
  <div class="layout-default">
    <Header />
    <slot />
  </div>
</template>

<script>
import Header from '@/components/common/Header.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LayoutDefault',
  components: {
    Header,
  },
});
</script>

<style scoped></style>
