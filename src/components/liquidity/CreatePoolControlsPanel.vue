<template>
  <CommonPanel class="hdx-liquidity-controls-panel-container">
    <div class="panel-header">Create pool</div>
    <div class="panel-body">
      <AssetInput
        :assets-list="asset1List"
        placeholder="Select asset 1"
        :asset="asset1"
        :on-asset-select="
          newSelectedAsset => onAssetChange('asset1', newSelectedAsset)
        "
      />
      <div class="panel-text-label spot-price-label" v-show="asset1 !== null">
        <span>
          My balance {{ getAssetDetailed(asset1).name }}:
          {{ getAssetDetailed(asset1).balanceFormatted }}</span
        >
      </div>
      <AssetInput
        :assets-list="asset2List"
        placeholder="Select asset 2"
        :asset="asset2"
        :on-asset-select="
          newSelectedAsset => onAssetChange('asset2', newSelectedAsset)
        "
      />
      <div class="panel-text-label spot-price-label" v-show="asset2 !== null">
        <span>
          My balance {{ getAssetDetailed(asset2).name }}:
          {{ getAssetDetailed(asset2).balanceFormatted }}</span
        >
      </div>
      <AmountInput
        :amount="amount"
        :amount-options="{ unit: '' }"
        :on-amount-change="onAmountChange"
        label="Pool Amount"
      />
      <AmountInput
        :amount="initialPrice"
        :amount-options="{ unit: '' }"
        :on-amount-change="onInitialPriceChange"
        label="Initial Price"
      />
      <ButtonCommon
        :on-click="onPoolCreateClick"
        custom-class="create-pool full-width"
        >Create</ButtonCommon
      >
    </div>
  </CommonPanel>
</template>

<script lang="ts">
import BigNumber from 'bignumber.js';
import { computed, defineComponent, onBeforeUnmount, onMounted } from 'vue';
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import notifications from '@/variables/notifications';
import AssetInput from '@/components/common/AssetInput.vue';
import AmountInput from '@/components/common/AmountInput.vue';

export default defineComponent({
  name: 'CreatePoolControlsPanel',
  components: {
    AssetInput,
    AmountInput,
  },
  props: {
    currentPool: {
      type: Object,
    },
  },
  setup(props) {
    const { getters, dispatch, commit } = useStore();
    // const toast = useToast();

    const newPoolProperties = computed(() => getters.newPoolPropertiesSMPool);
    const asset1 = computed(() => getters.newPoolPropertiesSMPool.asset1);
    const asset2 = computed(() => getters.newPoolPropertiesSMPool.asset2);
    const initialPrice = computed(
      () => getters.newPoolPropertiesSMPool.initialPrice
    );
    const amount = computed(() => getters.newPoolPropertiesSMPool.amount);

    const assetBalancesList = computed(() => {
      // console.log('assetsList - ', getters.assetBalancesSMWallet);
      return getters.assetBalancesSMWallet;
    });

    const dfv = [
      {
        assetId: 0,
        name: 'HDX',
        shareToken: false,
        balance: '1000000000000000',
        balanceFormatted: '1000',
      },
      {
        assetId: 12,
        name: 'HDX | tDOT',
        shareToken: true,
        balance: 0,
        balanceFormatted: '0',
      },
    ];

    const asset1List = computed(() => {
      return getters.assetBalancesSMWallet.filter(
        item =>
          !item.shareToken &&
          (newPoolProperties.value.asset2 === null ||
            +newPoolProperties.value.asset2 !== item.assetId)
      );
    });

    const asset2List = computed(() => {
      return getters.assetBalancesSMWallet.filter(
        item =>
          !item.shareToken &&
          (newPoolProperties.value.asset1 === null ||
            +newPoolProperties.value.asset1 !== item.assetId)
      );
    });

    const onAssetChange = (assetName: string, assetValue: string) => {
      let newAsset1: string | null = null;
      let newAsset2: string | null = null;

      if (assetName === 'asset1') {
        newAsset1 = assetValue;
        newAsset2 = asset2.value;
      } else if (assetName === 'asset2') {
        newAsset1 = asset1.value;
        newAsset2 = assetValue;
      }

      dispatch('changeNewPoolPropertiesSMPool', {
        asset1: newAsset1,
        asset2: newAsset2,
        initialPrice: initialPrice.value,
        amount: amount.value,
      });
    };

    const onAmountChange = (newAmount: BigNumber) => {
      dispatch('changeNewPoolPropertiesSMPool', {
        asset1: asset1.value,
        asset2: asset2.value,
        initialPrice: initialPrice.value,
        amount: newAmount,
      });
    };
    const onInitialPriceChange = (newAmount: BigNumber) => {
      dispatch('changeNewPoolPropertiesSMPool', {
        asset1: asset1.value,
        asset2: asset2.value,
        initialPrice: newAmount,
        amount: amount.value,
      });
    };

    const onPoolCreateClick = async () => {
      await dispatch('createPoolSMPool');
    };

    const getAssetDetailed = (assetId: string | null) => {
      if (assetId === null) return {};
      return (
        assetBalancesList.value.find(item => +item.assetId === +assetId) || {}
      );
    };

    onBeforeUnmount(() => {
      dispatch('changeNewPoolPropertiesSMPool', {
        asset1: null,
        asset2: null,
        initialPrice: new BigNumber(0),
        amount: new BigNumber(0),
      });
    });

    return {
      assetBalancesList,
      asset1List,
      asset2List,
      asset1,
      asset2,
      initialPrice,
      amount,
      onAmountChange,
      onInitialPriceChange,
      onAssetChange,
      onPoolCreateClick,
      getAssetDetailed,
    };
  },
});
</script>

<style scoped></style>
