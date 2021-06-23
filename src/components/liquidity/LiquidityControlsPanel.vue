<template>
  <CommonPanel
    class="hdx-liquidity-controls-panel-container"
    v-if="selectedPool && currentPool"
  >
    <div class="panel-header">{{ panelActionLabel }} liquidity</div>
    <div class="panel-body">
      <div class="spot-price-container">
        <template v-if="actionType === 'add'">
          <AssetAmountInput
            :amount-options="{ units: currentPool.poolAssetNames[0] }"
            :asset="currentPool.poolAssetNames[0]"
            single-asset
            :amount="liquidityAmount"
            :on-amount-change="onLiquidityAmountChange"
          />

          <BalanceIndicatorsGroup v-if="currentPool">
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

          <div class="panel-text-label spot-price-label">
            <span>
              1 {{ currentPool.poolAssetNames[0] }} =
              {{ spotPrice.amountFormatted }}
              {{ currentPool.poolAssetNames[1] }}
            </span>
          </div>

          <AssetAmountInput
            :asset="currentPool.poolAssetNames[1]"
            single-asset
            :amount="asset2Amount"
            input-disabled
          />
          <BalanceIndicatorsGroup v-if="currentPool">
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
        </template>
        <template v-else>
          <div class="panel-text-label spot-price-label">
            <span> BURN SHARE %: </span>
          </div>

          <CommonNumberInput v-model="liquidityAmount" />
        </template>
        <ButtonCommon
          :disabled="!isFormValid"
          :on-click="onPoolActionClick"
          custom-class="submit-transaction full-width"
          >{{ panelActionLabel }}</ButtonCommon
        >
      </div>
    </div>
  </CommonPanel>
</template>

<script lang="ts">
import BigNumber from 'bignumber.js';
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  reactive,
  ref,
  watch,
} from 'vue';
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import notifications from '@/variables/notifications';
import AssetAmountInput from '@/components/common/AssetAmountInput.vue';
import CommonNumberInput from '@/components/common/CommonNumberInput.vue';
import BalanceIndicatorsGroup from '@/components/common/BalanceIndicator/BalanceIndicatorsGroup.vue';
import BalanceIndicator from '@/components/common/BalanceIndicator/BalanceIndicator.vue';

export default defineComponent({
  name: 'LiquidityControlsPanel',
  components: {
    AssetAmountInput,
    CommonNumberInput,
    BalanceIndicatorsGroup,
    BalanceIndicator,
  },
  props: {
    currentPool: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { getters, dispatch, commit } = useStore();
    const router = useRouter();
    const toast = useToast();

    const isFormValid = ref(false);
    const validationState = reactive({
      isAmountValid: true,
      isAsset1AmountAfterValid: true,
      isAsset2AmountAfterValid: true,
      isAsset1BalanceValid: true,
      isAsset2BalanceValid: true,
    });

    // const poolInfo = computed(() => getters.poolInfoSMPool);

    const assetBalancesList = computed(() => getters.assetBalancesSMWallet);

    const actionType = computed(
      () => getters.liquidityPropertiesSMPool.actionType
    );

    const spotPrice = computed(() => getters.spotPriceSMTrade);

    const panelActionLabel = computed(() =>
      actionType.value === 'withdraw' ? 'Remove' : 'Add'
    );

    const liquidityAmount = computed({
      get: () => getters.liquidityAmountSMPool,
      set: (liquidityAmountUpdated: BigNumber) => {
        commit('SET_LIQUIDITY_AMOUNT__POOL', liquidityAmountUpdated);
      },
    });

    // TODO reimplement for calculation via SDK
    const asset2Amount = computed(() => {
      return liquidityAmount.value.multipliedBy(spotPrice.value.amount);
      // return calculateSpotAmount(
      //   props.currentPool.poolAssetNames[0],
      //   props.currentPool.poolAssetNames[1],
      //   liquidityAmount.value
      // );
    });

    console.log('props.currentPool - ', props.currentPool);

    const asset1Detailed = computed(() => {
      // eslint-disable-next-line no-undef
      if (props.currentPool === undefined) return {} as AssetBalance;
      return (
        assetBalancesList.value.find(
          item => +item.assetId === +props.currentPool.poolAssets[0]
          // eslint-disable-next-line no-undef
        ) || ({} as AssetBalance)
      );
    });

    const asset2Detailed = computed(() => {
      // eslint-disable-next-line no-undef
      if (props.currentPool === undefined) return {} as AssetBalance;
      return (
        assetBalancesList.value.find(
          item => +item.assetId === +props.currentPool.poolAssets[1]
          // eslint-disable-next-line no-undef
        ) || ({} as AssetBalance)
      );
    });

    const assetAmountAfterTransaction = (asset: string): BigNumber => {
      let amountAfter = new BigNumber(0);

      if (asset === 'asset1' && asset1Detailed.value.balance) {
        amountAfter = asset1Detailed.value.balance.minus(liquidityAmount.value);
      } else if (asset === 'asset2' && asset2Detailed.value.balance) {
        amountAfter = asset2Detailed.value.balance.minus(asset2Amount.value);
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

    const onLiquidityAmountChange = (liquidityAmountUpdated: BigNumber) => {
      liquidityAmount.value = liquidityAmountUpdated;
      // commit('SET_LIQUIDITY_AMOUNT__POOL', liquidityAmountUpdated);
      // dispatch('changeLiquidityAmountSMPool', liquidityAmountUpdated);
    };

    const onPoolActionClick = () => {
      if (!getters.accountSMWallet || !getters.extensionInfoSMGeneral) {
        toast.error(notifications.connectAccountIsRequired);
        router.push('/wallet');
        return;
      }
      if (actionType.value === 'add') {
        dispatch('addLiquiditySMPool');
      } else {
        dispatch('withdrawLiquiditySMPool');
      }
    };

    const validateAddRemoveLiquidityForm = (newLiquidityAmount: BigNumber) => {
      let isAmountValid = false;
      let isAsset1AmountAfterValid = false;
      let isAsset2AmountAfterValid = false;
      let isAsset1BalanceValid = false;
      let isAsset2BalanceValid = false;

      if (
        actionType.value === 'add' &&
        asset2Detailed.value.balance !== undefined &&
        newLiquidityAmount.isLessThan(asset2Detailed.value.balance) &&
        !newLiquidityAmount.isZero() &&
        newLiquidityAmount.isPositive()
      )
        isAmountValid = true;

      if (
        actionType.value === 'withdraw' &&
        newLiquidityAmount.isLessThan(new BigNumber(100)) &&
        !newLiquidityAmount.isZero() &&
        newLiquidityAmount.isPositive()
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

      if (actionType.value === 'add') {
        isFormValid.value =
          isAsset1AmountAfterValid &&
          isAsset2AmountAfterValid &&
          isAsset1BalanceValid &&
          isAsset2BalanceValid &&
          isAmountValid;
      } else {
        isFormValid.value = isAmountValid;
      }

      validationState.isAmountValid = isAmountValid;
      validationState.isAsset1AmountAfterValid = isAsset1AmountAfterValid;
      validationState.isAsset2AmountAfterValid = isAsset2AmountAfterValid;
      validationState.isAsset1BalanceValid = isAsset1BalanceValid;
      validationState.isAsset2BalanceValid = isAsset2BalanceValid;
    };

    watch(() => getters.liquidityAmountSMPool, validateAddRemoveLiquidityForm);

    onBeforeUnmount(() => {
      // onLiquidityAmountChange(new BigNumber(0));
      liquidityAmount.value = new BigNumber(0);
    });

    return {
      selectedPool: computed(() => getters.selectedPoolSMPool),
      assetBalancesList,

      liquidityAmount,
      actionType,
      panelActionLabel,
      asset2Amount,
      spotPrice,

      isFormValid,

      asset1Detailed,
      asset2Detailed,
      validationState,
      asset1AmountAfterTransaction,
      asset2AmountAfterTransaction,

      onLiquidityAmountChange,
      onPoolActionClick,
    };
  },
});
</script>

<style scoped></style>
