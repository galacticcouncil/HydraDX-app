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
      <template v-if="Object.entries(tokenTradeMap).length">
        <div class="spot-price-container">
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

          <div class="panel-text-label spot-price-label">
            <span v-if="asset1 !== null && asset2 !== null">
              1 {{ getAssetName(asset1, asset1List) }} =
              {{ spotPrice.amountFormatted }}
              {{ getAssetName(asset2, asset2List) }}
            </span>
          </div>

          <AssetAmountInput
            :assets-list="asset2List"
            :asset="asset2"
            :on-asset-select="
              newSelectedAsset => onAssetChange('asset2', newSelectedAsset)
            "
            :amount="sellPrice.amount"
            input-disabled
          />

          <ButtonCommon
            :on-click="swap"
            custom-class="submit-transaction full-width"
            >{{ actionType }}</ButtonCommon
          >
        </div>
      </template>
      <template v-else>
        <div class="full-panel-notice">
          <span>AWWW... NO POOLS TO TRADE</span>
        </div>
      </template>
    </div>
  </CommonPanel>
</template>

<script lang="ts">
import { UnwrapRef, ComputedRef } from '@vue/reactivity';
import { computed, defineComponent, onMounted, watch, ref } from 'vue';
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

type AssetRecord = {
  assetId: number;
  name: string;
  icon?: string;
};

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
    const isInitialAsset1Configured = ref(false);
    const isInitialAsset2Configured = ref(false);
    const router = useRouter();
    const toast = useToast();
    const asset1 = computed(() => getters.tradePropertiesSMTrade.asset1);
    const asset2 = computed(() => getters.tradePropertiesSMTrade.asset2);

    const asset1List = computed(() => {
      return getters.assetListSMWallet.filter(
        //@ts-ignore
        element =>
          Object.keys(getters.tokenTradeMapSMTrade).findIndex(
            assetId => +assetId === +element.assetId
          ) >= 0
      );
    });

    const asset2List = computed(() => {
      return getters.assetListSMWallet.filter(element => {
        if (asset1.value) {
          return (
            getters.tokenTradeMapSMTrade[+asset1.value].findIndex(
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
    };
    watch(asset1List, newVal => {
      if (newVal && newVal.length > 0 && !isInitialAsset1Configured.value) {
        let initialAsset = newVal.find(asset => asset.assetId === 0);
        if (!initialAsset) initialAsset = newVal[0];

        onAssetChange('asset1', initialAsset.assetId.toString());
        isInitialAsset1Configured.value = true;
      }
    });
    watch(asset2List, newVal => {
      if (newVal && newVal.length > 0 && !isInitialAsset2Configured.value) {
        const initialAsset = newVal[0];

        onAssetChange('asset2', initialAsset.assetId.toString());
        isInitialAsset2Configured.value = true;
      }
    });

    const getAssetName = (
      assetId: string,
      assetsList: UnwrapRef<ComputedRef<AssetRecord[]>>
    ) => {
      const selectedAsset = assetsList.find(
        asset => asset.assetId === +assetId
      );

      if (!selectedAsset) return '';
      return selectedAsset.name;
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
      getAssetName,
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
