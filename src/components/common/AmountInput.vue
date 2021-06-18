<template>
  <div
    class="hdx-amount-input"
    :class="{
      'opt-available': amountOptions && amountOptions.units !== undefined,
    }"
  >
    <div class="hdx-input-label" v-show="label">{{ label }}</div>
    <div class="hdx-amount-input-inner-container">
      <BalanceInput
        v-model="amountValue"
        :options="amountOptions"
        :input-disabled="inputDisabled"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import BigNumber from 'bignumber.js';

export default defineComponent({
  name: 'AssetAmountInput',
  props: {
    onAmountChange: {
      type: Function,
      default: () => {
        return {};
      },
    },
    amount: {
      type: Object as () => BigNumber,
      default: () => {
        return {};
      },
    },
    amountOptions: {
      type: Object,
      default: () => {
        return {};
      },
    },
    inputDisabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const amountValue = computed({
      get: () => props.amount,
      set: (newAmount: BigNumber) => {
        props.onAmountChange(newAmount);
      },
    });

    return {
      amountValue,
    };
  },
});
</script>
