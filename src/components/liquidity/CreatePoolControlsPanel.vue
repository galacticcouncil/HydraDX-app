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
            :valid="validationState.isAsset1BalanceValid"
          />
          <BalanceIndicator
            class="sub-value"
            :amount="asset1AmountAfterTransaction"
            :label="`Balance after transaction:`"
            :ending="asset1Detailed.name"
            :valid="validationState.isAsset1AmountAfterValid"
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
            :valid="validationState.isAsset2BalanceValid"
          />
          <BalanceIndicator
            class="sub-value"
            :amount="asset2AmountAfterTransaction"
            :label="`Balance after transaction:`"
            :ending="asset2Detailed.name"
            :valid="validationState.isAsset2AmountAfterValid"
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
import { useRouter } from 'vue-router';

type NewPoolProperties = {
  asset1: string | null;
  asset2: string | null;
  initialPrice: BigNumber;
  amount: BigNumber;
};

import BigNumber from 'bignumber.js';
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  ref,
  watch,
  reactive,
} from 'vue';
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
    const router = useRouter();
    // const toast = useToast();
    const isCreatePoolFormValid = ref(false);
    const validationState = reactive({
      isAmountValid: true,
      isPriceValid: true,
      isAssetValid: true,
      isAsset1AmountAfterValid: true,
      isAsset2AmountAfterValid: true,
      isAsset1BalanceValid: true,
      isAsset2BalanceValid: true,
    });

    const newPoolProperties = computed(
      () => getters.newPoolPropertiesSMSinglePool
    );
    const asset1 = computed(() => getters.newPoolPropertiesSMSinglePool.asset1);
    const asset2 = computed(() => getters.newPoolPropertiesSMSinglePool.asset2);
    const initialPrice = computed(
      () => getters.newPoolPropertiesSMSinglePool.initialPrice
    );
    const amount = computed(() => getters.newPoolPropertiesSMSinglePool.amount);

    const assetBalancesList = computed(() => getters.assetBalancesSMWallet);

    const asset1Detailed = computed(() => {
      // eslint-disable-next-line no-undef
      if (asset1.value === null) return {} as AssetBalance;
      return (
        assetBalancesList.value.find(
          item => asset1.value !== null && +item.assetId === +asset1.value
          // eslint-disable-next-line no-undef
        ) || ({} as AssetBalance)
      );
    });

    const asset2Detailed = computed(() => {
      // eslint-disable-next-line no-undef
      if (asset2.value === null) return {} as AssetBalance;
      return (
        assetBalancesList.value.find(
          item => asset2.value !== null && +item.assetId === +asset2.value
          // eslint-disable-next-line no-undef
        ) || ({} as AssetBalance)
      );
    });

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
      let amountAfter = new BigNumber(0);

      if (asset === 'asset1' && asset1Detailed.value.balance) {
        amountAfter = asset1Detailed.value.balance.minus(amount.value);
      } else if (asset === 'asset2' && asset2Detailed.value.balance) {
        amountAfter = asset2Detailed.value.balance.minus(
          requiredAsset2Amount.value
        );
      }

      return !amountAfter.isNaN() &&
        amountAfter.isPositive() &&
        amountAfter.isFinite()
        ? amountAfter
        : new BigNumber(0);
    };

    const asset1AmountAfterTransaction = computed(() =>
      assetAmountAfterTransaction('asset1')
    );
    const asset2AmountAfterTransaction = computed(() =>
      assetAmountAfterTransaction('asset2')
    );

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

      dispatch('changeNewPoolPropertiesSMSinglePool', {
        asset1: newAsset1,
        asset2: newAsset2,
        initialPrice: initialPrice.value,
        amount: amount.value,
      });
    };

    const onAmountChange = (newAmount: BigNumber) => {
      dispatch('changeNewPoolPropertiesSMSinglePool', {
        asset1: asset1.value,
        asset2: asset2.value,
        initialPrice: initialPrice.value,
        amount: newAmount,
      });
    };
    const onInitialPriceChange = (newAmount: BigNumber) => {
      dispatch('changeNewPoolPropertiesSMSinglePool', {
        asset1: asset1.value,
        asset2: asset2.value,
        initialPrice: newAmount,
        amount: amount.value,
      });
    };

    const onPoolCreateClick = async () => {
      await dispatch('createPoolSMSinglePool');
      await router.push(router.currentRoute.value.path);
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
      let isAsset1AmountAfterValid = false;
      let isAsset2AmountAfterValid = false;
      let isAsset1BalanceValid = false;
      let isAsset2BalanceValid = false;

      if (
        asset2Detailed.value.balance !== undefined &&
        poolProps.amount.isLessThan(asset2Detailed.value.balance)
      )
        isAmountValid = true;

      if (
        !asset1AmountAfterTransaction.value.isZero() &&
        asset1AmountAfterTransaction.value.isPositive()
      )
        isAsset1AmountAfterValid = true;

      if (
        !asset2AmountAfterTransaction.value.isZero() &&
        asset2AmountAfterTransaction.value.isPositive()
      )
        isAsset2AmountAfterValid = true;

      if (
        asset1Detailed.value.balance &&
        !asset1Detailed.value.balance.isZero() &&
        asset1Detailed.value.balance.isPositive()
      )
        isAsset1BalanceValid = true;

      if (
        asset2Detailed.value.balance &&
        !asset2Detailed.value.balance.isZero() &&
        asset2Detailed.value.balance.isPositive()
      )
        isAsset2BalanceValid = true;

      if (
        poolProps.initialPrice.isPositive() &&
        !poolProps.initialPrice.isZero()
      )
        isPriceValid = true;

      if (poolProps.asset1 !== null && poolProps.asset2) {
        isAssetValid = true;
      }

      isCreatePoolFormValid.value =
        isAsset1AmountAfterValid &&
        isAsset2AmountAfterValid &&
        isAsset1BalanceValid &&
        isAsset2BalanceValid &&
        isAmountValid &&
        isAssetValid &&
        isPriceValid;

      validationState.isAmountValid = isAmountValid;
      validationState.isPriceValid = isPriceValid;
      validationState.isAssetValid = isAssetValid;
      validationState.isAsset1AmountAfterValid = isAsset1AmountAfterValid;
      validationState.isAsset2AmountAfterValid = isAsset2AmountAfterValid;
      validationState.isAsset1BalanceValid = isAsset1BalanceValid;
      validationState.isAsset2BalanceValid = isAsset2BalanceValid;
    };

    watch(() => getters.newPoolPropertiesSMSinglePool, validateCreatePoolForm);

    onBeforeUnmount(() => {
      dispatch('changeNewPoolPropertiesSMSinglePool', {
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
      asset1AmountAfterTransaction,
      asset2AmountAfterTransaction,
      onAmountChange,
      onInitialPriceChange,
      onAssetChange,
      onPoolCreateClick,
      validationState,
    };
  },
});
</script>

<style scoped></style>
