<template>
  <Wallet />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Wallet from '@/components/Wallet.vue';

export default defineComponent({
  name: 'Wallet',
  components: {
    Wallet,
  },
});
</script>
