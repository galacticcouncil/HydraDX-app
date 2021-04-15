<template>
  <div class="hdx-balance-indicator">
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
  },
  setup(props) {
    const amountFormatted = computed(() => {
      if (props.round && props.round.length > 0) {
        return props.amount
          .dividedBy(props.noExponential ? '1' : '1e12')
          .toFixed(+props.round);
      }
      return props.amount
        .dividedBy(props.noExponential ? '1' : '1e12')
        .toString();
    });

    return {
      amountFormatted,
    };
  },
});
</script>
