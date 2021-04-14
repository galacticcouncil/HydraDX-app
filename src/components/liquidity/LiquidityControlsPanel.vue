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
        </template>
        <template v-else>
          <div class="panel-text-label spot-price-label">
            <span> BURN SHARE %: </span>
          </div>

          <CommonNumberInput v-model="liquidityAmount" />
        </template>
        <ButtonCommon
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
import { computed, defineComponent, onBeforeUnmount, onMounted } from 'vue';
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { calculateSpotAmount } from '@/services/utils';
import notifications from '@/variables/notifications';
import AssetAmountInput from '@/components/common/AssetAmountInput.vue';
import CommonNumberInput from '@/components/common/CommonNumberInput.vue';

export default defineComponent({
  name: 'LiquidityControlsPanel',
  components: {
    AssetAmountInput,
    CommonNumberInput,
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

    // const poolInfo = computed(() => getters.poolInfoSMPool);

    const actionType = computed(() => {
      console.log('actionType');
      return getters.liquidityPropertiesSMPool.actionType;
    });

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

    const asset2Amount = computed(() => {
      return liquidityAmount.value.multipliedBy(spotPrice.value.amount);
      // return calculateSpotAmount(
      //   props.currentPool.poolAssetNames[0],
      //   props.currentPool.poolAssetNames[1],
      //   liquidityAmount.value
      // );
    });

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

    onBeforeUnmount(() => {
      // onLiquidityAmountChange(new BigNumber(0));
      liquidityAmount.value = new BigNumber(0);
    });

    return {
      selectedPool: computed(() => getters.selectedPoolSMPool),
      liquidityAmount,
      onLiquidityAmountChange,
      actionType,
      // poolInfo,
      panelActionLabel,
      onPoolActionClick,
      asset2Amount,
      assetBalances: computed(() => getters.assetBalancesSMWallet),
      spotPrice,
    };
  },
});
</script>

<style scoped></style>
