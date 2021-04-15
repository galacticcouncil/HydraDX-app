<template>
  <div class="hdx-balance-indicators-group-container">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BalanceIndicatorsGroup',
});
</script>
