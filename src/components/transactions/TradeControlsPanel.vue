<template>
  <CommonPanel class="hdx-trade-controls-panel-container">
    <div class="trade-type-controls-container">
      <div class="trade-action-type-select">
        <ButtonWithStatus
          :on-click="() => setActionType('buy')"
          :active="actionType === 'buy'"
          custom-class="trade-action-type"
          >Buy</ButtonWithStatus
        >
        <ButtonWithStatus
          :on-click="() => setActionType('sell')"
          :active="actionType === 'sell'"
          custom-class="trade-action-type"
          >Sell</ButtonWithStatus
        >
      </div>
    </div>
    <div class="panel-body">
      <div class="spot-price-container">
        <div class="panel-text-label">
          Spot Price: {{ spotPrice.amountFormatted }}
        </div>

        <AssetAmountInput
          :assets-list="asset1List"
          :asset="asset1"
          :on-asset-select="
            newSelectedAsset => onAssetChange('asset1', newSelectedAsset)
          "
          :amount="tradeAmount"
          :amount-options="tradeAmountOptions"
          :on-amount-change="setTradeAmount"
        />

        <AssetAmountInput
          :assets-list="asset2List"
          :asset="asset2"
          :on-asset-select="
            newSelectedAsset => onAssetChange('asset2', newSelectedAsset)
          "
          :amount="tradeAmount"
          :amount-options="tradeAmountOptions"
          input-disabled
        />
      </div>
    </div>
  </CommonPanel>
</template>

<script lang="ts">
import * as BN from 'bn.js';

import { computed, defineComponent } from 'vue';
import { useStore } from '@/store';
import AssetAmountInput from '@/components/common/AssetAmountInput.vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import notifications from '@/variables/notifications';
import {
  tradeAmountOptions,
  tradeAmount,
  setTradeAmount,
} from '@/services/componentsServices/tradaAmount';

export default defineComponent({
  name: 'TradesListPanel',
  components: {
    AssetAmountInput,
  },
  setup() {
    const { getters, dispatch } = useStore();

    // -----------------------------------
    // -----------------------------------
    // -----------------------------------

    const router = useRouter();
    const toast = useToast();

    // const asset1 = computed({
    //   get: () => getters.tradePropertiesSMTrade.asset1,
    //   set: asset1 => {
    //     dispatch('changeTradePropertiesSMTrade', {
    //       asset1,
    //       asset2: null,
    //       actionType: getters.tradePropertiesSMTrade.actionType,
    //     });
    //   },
    // });

    const asset1 = computed(() => getters.tradePropertiesSMTrade.asset1);

    const asset2 = computed({
      get: () => getters.tradePropertiesSMTrade.asset2,
      set: asset2 => {
        dispatch('changeTradePropertiesSMTrade', {
          asset2,
          asset1: getters.tradePropertiesSMTrade.asset1,
          actionType: getters.tradePropertiesSMTrade.actionType,
        });
      },
    });
    // const actionType = computed({
    //   get: () => getters.tradePropertiesSMTrade.actionType,
    //   set: actionType => {
    //     dispatch('changeTradePropertiesSMTrade', {
    //       asset1: getters.tradePropertiesSMTrade.asset1,
    //       asset2: getters.tradePropertiesSMTrade.asset2,
    //       actionType,
    //     });
    //   },
    // });

    const asset1List = computed(() => {
      return getters.assetListSMWallet.filter(
        element =>
          Object.keys(getters.tokenTradeMapSMTrade).findIndex(
            assetId => parseInt(assetId) === element.assetId
          ) >= 0
      );
    });

    const asset2List = computed(() => {
      return getters.assetListSMWallet.filter(element => {
        // const asset1 = asset1 as number | null;
        if (asset1.value) {
          return (
            //@ts-ignore
            getters.tokenTradeMapSMTrade[asset1.value].findIndex(
              (assetId: number) => assetId === element.assetId
            ) >= 0
          );
        } else return false;
      });
    });

    const swap = () => {
      if (getters.accountSMWallet && getters.extensionInfoSMGeneral) {
        dispatch('swapSMTrade');
      } else {
        toast.error(notifications.connectAccountIsRequired);
        router.push('/wallet');
      }
    };

    // -----------------------------------
    // -----------------------------------
    // -----------------------------------

    const setActionType = (actionType: string) => {
      dispatch('changeTradePropertiesSMTrade', {
        asset1: getters.tradePropertiesSMTrade.asset1,
        asset2: getters.tradePropertiesSMTrade.asset2,
        actionType,
      });
    };

    const onAssetChange = (assetName: string, assetValue: string) => {
      let newAsset1: string | null = null;
      let newAsset2: string | null = null;

      if (assetName === 'asset1') {
        newAsset1 = assetValue;
      } else if (assetName === 'asset2') {
        newAsset1 = getters.tradePropertiesSMTrade.asset1;
        newAsset2 = assetValue;
      }

      dispatch('changeTradePropertiesSMTrade', {
        asset1: newAsset1,
        asset2: newAsset2,
        actionType: getters.tradePropertiesSMTrade.actionType,
      });

      console.log('assetName - ', assetName);
      console.log('assetValue - ', assetValue);
    };

    return {
      actionType: computed(() => getters.tradePropertiesSMTrade.actionType),
      setActionType,
      spotPrice: computed(() => getters.spotPriceSMTrade),
      onAssetChange,
      tradeAmountOptions,
      tradeAmount,
      setTradeAmount,
      // -----

      poolInfo: computed(() => getters.poolInfoSMPool),
      assetList: computed(() => getters.assetListSMWallet),
      tokenTradeMap: computed(() => getters.tokenTradeMapSMTrade),
      assetBalances: computed(() => getters.assetBalancesSMWallet),
      sellPrice: computed(() => getters.sellPriceSMTrade),
      asset1,
      asset2,
      asset1List,
      asset2List,
      swap,
    };
  },
});
</script>

<style scoped></style>
