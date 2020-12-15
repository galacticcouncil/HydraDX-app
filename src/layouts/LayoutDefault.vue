<template>
  <div>
    <Header />
    <slot />
  </div>
</template>

<script>
import Header from './components/Header.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LayoutDefault',
  components: {
    Header,
  },
});
</script>

<style scoped></style>
