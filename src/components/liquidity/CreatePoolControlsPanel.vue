<template>
  <CommonPanel class="hdx-liquidity-controls-panel-container">
    <div class="panel-header">Create pool</div>
    <div class="panel-body">
      <div class="asset-select-with-details-container">
        <AssetInput
          :assets-list="asset1List"
          placeholder="Select asset 1"
          :asset="asset1"
          :on-asset-select="
            newSelectedAsset => onAssetChange('asset1', newSelectedAsset)
          "
        />
        <BalanceIndicatorsGroup v-show="asset1 !== null">
          <BalanceIndicator
            :amount="asset1Detailed.balance"
            :label="`Available balance:`"
            :ending="asset1Detailed.name"
          />
          <BalanceIndicator
            class="sub-value"
            :amount="assetAmountAfterTransaction('asset1')"
            :label="`Balance after transaction:`"
            :ending="asset1Detailed.name"
          />
        </BalanceIndicatorsGroup>
      </div>

      <div class="asset-select-with-details-container">
        <AssetInput
          :assets-list="asset2List"
          placeholder="Select asset 2"
          :asset="asset2"
          :on-asset-select="
            newSelectedAsset => onAssetChange('asset2', newSelectedAsset)
          "
        />
        <BalanceIndicatorsGroup v-show="asset2 !== null">
          <BalanceIndicator
            :amount="asset2Detailed.balance"
            :label="`Available balance:`"
            :ending="asset2Detailed.name"
          />
          <BalanceIndicator
            class="sub-value"
            :amount="assetAmountAfterTransaction('asset2')"
            :label="`Balance after transaction:`"
            :ending="asset2Detailed.name"
          />
        </BalanceIndicatorsGroup>
      </div>

      <AmountInput
        :amount="amount"
        :amount-options="{ units: '' }"
        :on-amount-change="onAmountChange"
        label="Pool Amount"
        :input-disabled="false"
      />
      <AmountInput
        :amount="initialPrice"
        :amount-options="{ units: '' }"
        :on-amount-change="onInitialPriceChange"
        label="Initial Price"
        :input-disabled="false"
      />
      <BalanceIndicator
        v-show="asset2 !== null"
        :amount="requiredAsset2Amount"
        :label="`Required amount of ${asset2Detailed.name}:`"
        no-exponential
      />
      <ButtonCommon
        :disabled="!isCreatePoolFormValid"
        :on-click="onPoolCreateClick"
        custom-class="create-pool full-width"
        >Create</ButtonCommon
      >
    </div>
  </CommonPanel>
</template>

<script lang="ts">
type NewPoolProperties = {
  asset1: string | null;
  asset2: string | null;
  initialPrice: BigNumber;
  amount: BigNumber;
};

import BigNumber from 'bignumber.js';
import { computed, defineComponent, onBeforeUnmount, ref, watch } from 'vue';
import { useStore } from '@/store';
import AssetInput from '@/components/common/AssetInput.vue';
import AmountInput from '@/components/common/AmountInput.vue';
import BalanceIndicatorsGroup from '@/components/common/BalanceIndicator/BalanceIndicatorsGroup.vue';
import BalanceIndicator from '@/components/common/BalanceIndicator/BalanceIndicator.vue';

export default defineComponent({
  name: 'CreatePoolControlsPanel',
  components: {
    AssetInput,
    AmountInput,
    BalanceIndicator,
    BalanceIndicatorsGroup,
  },
  props: {
    currentPool: {
      type: Object,
    },
  },
  setup() {
    const { getters, dispatch } = useStore();
    // const toast = useToast();
    const isCreatePoolFormValid = ref(false);

    const newPoolProperties = computed(() => getters.newPoolPropertiesSMPool);
    const asset1 = computed(() => getters.newPoolPropertiesSMPool.asset1);
    const asset2 = computed(() => getters.newPoolPropertiesSMPool.asset2);
    const initialPrice = computed(
      () => getters.newPoolPropertiesSMPool.initialPrice
    );
    const amount = computed(() => getters.newPoolPropertiesSMPool.amount);

    const assetBalancesList = computed(() => getters.assetBalancesSMWallet);

    const asset1Detailed = computed(() => {
      if (asset1.value === null) return {} as AssetBalance;
      return (
        assetBalancesList.value.find(
          item => asset1.value !== null && +item.assetId === +asset1.value
        ) || ({} as AssetBalance)
      );
    });

    const asset2Detailed = computed(() => {
      if (asset2.value === null) return {} as AssetBalance;
      return (
        assetBalancesList.value.find(
          item => asset2.value !== null && +item.assetId === +asset2.value
        ) || ({} as AssetBalance)
      );
    });

    // const dfv = [
    //   {
    //     assetId: 0,
    //     name: 'HDX',
    //     shareToken: false,
    //     balance: '1000000000000000',
    //     balanceFormatted: '1000',
    //   },
    //   {
    //     assetId: 12,
    //     name: 'HDX | tDOT',
    //     shareToken: true,
    //     balance: 0,
    //     balanceFormatted: '0',
    //   },
    // ];

    const getAssetsListForExclude = (
      selectedPairAsset: string | null
    ): string[] => {
      return getters.assetListSMWallet
        .map(element => {
          if (
            selectedPairAsset !== null &&
            getters.tokenTradeMapSMTrade[+selectedPairAsset] !== undefined &&
            getters.tokenTradeMapSMTrade[+selectedPairAsset].findIndex(
              (assetId: number) => assetId === element.assetId
            ) >= 0
          ) {
            return element.assetId.toString();
          } else return '';
        })
        .filter(item => item.length > 0);
    };

    const asset1List = computed(() => {
      let assetsListForExclude: string[] = [];

      if (asset2.value !== null) {
        assetsListForExclude = getAssetsListForExclude(asset2.value);
      }

      return getters.assetBalancesSMWallet.filter(
        item =>
          !item.shareToken &&
          (newPoolProperties.value.asset2 === null ||
            +newPoolProperties.value.asset2 !== item.assetId) &&
          !assetsListForExclude.includes(item.assetId.toString())
      );
    });

    const asset2List = computed(() => {
      let assetsListForExclude: string[] = [];

      if (asset1.value !== null) {
        assetsListForExclude = getAssetsListForExclude(asset1.value);
      }

      return assetBalancesList.value.filter(
        item =>
          !item.shareToken &&
          (newPoolProperties.value.asset1 === null ||
            +newPoolProperties.value.asset1 !== item.assetId) &&
          !assetsListForExclude.includes(item.assetId.toString())
      );
    });

    const requiredAsset2Amount = computed(() => {
      return initialPrice.value.multipliedBy(amount.value);
    });

    const assetAmountAfterTransaction = (asset: string): BigNumber => {
      if (asset === 'asset1') {
        return asset1Detailed.value.balance
          ? asset1Detailed.value.balance.minus(
              amount.value.multipliedBy('1e12')
            )
          : new BigNumber(0);
      } else {
        return asset2Detailed.value.balance
          ? asset2Detailed.value.balance.minus(
              requiredAsset2Amount.value.multipliedBy('1e12')
            )
          : new BigNumber(0);
      }
    };

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

    // const getAssetDetailed = (assetId: string | null): AssetBalance => {
    //   if (assetId === null) return {} as AssetBalance;
    //   return (
    //     assetBalancesList.value.find(item => +item.assetId === +assetId) ||
    //     ({} as AssetBalance)
    //   );
    // };

    const validateCreatePoolForm = (poolProps: NewPoolProperties) => {
      let isAmountValid = false;
      let isPriceValid = false;
      let isAssetValid = false;

      if (
        asset2Detailed.value.balance !== undefined &&
        poolProps.amount
          .multipliedBy('1e12')
          .isLessThan(asset2Detailed.value.balance)
      )
        isAmountValid = true;

      if (
        poolProps.initialPrice.isPositive() &&
        !poolProps.initialPrice.isZero()
      )
        isPriceValid = true;

      if (poolProps.asset1 !== null && poolProps.asset2) {
        isAssetValid = true;
      }

      isCreatePoolFormValid.value =
        isAmountValid && isAssetValid && isPriceValid;
    };

    watch(() => getters.newPoolPropertiesSMPool, validateCreatePoolForm);

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
      asset1Detailed,
      asset2Detailed,
      requiredAsset2Amount,
      initialPrice,
      amount,
      isCreatePoolFormValid,
      assetAmountAfterTransaction,
      onAmountChange,
      onInitialPriceChange,
      onAssetChange,
      onPoolCreateClick,
    };
  },
});
</script>

<style scoped></style>
