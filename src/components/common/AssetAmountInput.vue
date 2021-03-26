<template>
  <div
    class="hdx-asset-amount-input"
    :class="{
      'opt-available': amountOptions && amountOptions.units !== undefined,
    }"
  >
    <div class="hdx-asset-amount-input-inner-container">
      <select class="asset-selector" v-model="currentAsset">
        <option
          v-for="(asset, index) in assetsList"
          :key="index"
          :value="asset.assetId.toString()"
        >
          {{ asset.name }}
        </option>
      </select>
      <BalanceInput
        v-model="amountValue"
        :options="amountOptions"
        :input-disabled="inputDisabled"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, watch } from 'vue';
import BigNumber from 'bignumber.js';
import BalanceInput from '@/components/BalanceInput.vue';

export default defineComponent({
  name: 'AssetAmountInput',
  props: {
    assetsList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    asset: {
      type: String,
      default: '',
    },
    onAssetSelect: {
      type: Function,
      default: () => {},
    },
    onAmountChange: {
      type: Function,
      default: () => {},
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
  },
  components: {
    BalanceInput,
  },
  setup(props, context) {
    // const compState = reactive({
    //   range: '1',
    // });

    const currentAsset = computed({
      get: () => props.asset,
      set: (selectedAsset: string) => {
        props.onAssetSelect(selectedAsset);
      },
    });
    const amountValue = computed({
      get: () => props.amount,
      set: (newAmount: BigNumber) => {
        props.onAmountChange(newAmount);
      },
    });

    return {
      currentAsset,
      amountValue,
    };
  },
});
</script>
