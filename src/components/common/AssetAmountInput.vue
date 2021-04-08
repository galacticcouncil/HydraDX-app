<template>
  <div
    class="hdx-asset-amount-input"
    :class="{
      'opt-available': amountOptions && amountOptions.units !== undefined,
    }"
  >
    <div class="hdx-asset-amount-input-inner-container">
      <select
        class="asset-selector"
        v-model="currentAsset"
        :disabled="singleAsset"
      >
        <template v-if="!singleAsset">
          <option
            v-for="(asset, index) in assetsList"
            :key="index"
            :value="asset.assetId.toString()"
          >
            {{ asset.name }}
          </option>
        </template>
        <template v-else>
          <option :value="currentAsset" selected>{{ currentAsset }}</option>
        </template>
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
import { defineComponent, computed } from 'vue';
import BigNumber from 'bignumber.js';

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
      default: () => {
        return;
      },
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
    singleAsset: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    // const compState = reactive({
    //   range: '1',
    // });

    console.log('props - ', props);

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
