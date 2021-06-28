<template>
  <div class="hdx-balance-indicator" :class="{ 'not-valid-value': !valid }">
    <div class="label">{{ label }}</div>
    <div class="amount">{{ amountFormatted }} {{ ending }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import BigNumber from 'bignumber.js';

export default defineComponent({
  name: 'BalanceIndicator',
  props: {
    amount: {
      type: Object as () => BigNumber,
      default: new BigNumber(0),
    },
    round: {
      type: String,
      default: '',
    },
    noExponential: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: 'Balance',
    },
    ending: {
      type: String,
      default: '',
    },
    valid: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const amountFormatted = computed(() => {
      if (props.round && props.round.length > 0) {
        return props.amount ? props.amount.toFixed(+props.round) : '0';
      }
      return props.amount ? props.amount.toString() : '0';
    });

    return {
      amountFormatted,
    };
  },
});
</script>
