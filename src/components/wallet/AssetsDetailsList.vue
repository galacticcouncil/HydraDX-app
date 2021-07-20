<template>
  <PagePanelLayout class="hdx-assets-list-container">
    <div class="hdx-table-container col-num-5" role="table">
      <div class="flex-table header" role="rowgroup">
        <div class="flex-row first" role="columnheader">Token</div>
        <div class="flex-row" role="columnheader">Total balance</div>
        <div class="flex-row" role="columnheader">Free balance</div>
        <div class="flex-row" role="columnheader">Reserved balance</div>
        <div class="flex-row" role="columnheader">Get token</div>
      </div>

      <div
        class="flex-table row align-center"
        role="rowgroup"
        v-for="assetRecord in assetBalancesSorted"
        :key="assetRecord.assetId"
      >
        <div class="flex-row first" role="cell">
          {{ assetRecord.name }}
        </div>
        <div class="flex-row" role="cell">
          {{ assetRecord.totalBalanceFormatted }}
        </div>
        <div class="flex-row" role="cell">
          {{ assetRecord.freeBalanceFormatted }}
        </div>
        <div class="flex-row" role="cell">
          {{ assetRecord.reservedBalanceFormatted }}
        </div>
        <div class="flex-row" role="cell">
          <ButtonCommon
            small
            :on-click="() => mintAsset(assetRecord.assetId)"
            custom-class="mt-0 mb-0"
            pd-dapp-required
            >GET</ButtonCommon
          >
        </div>
      </div>
    </div>
  </PagePanelLayout>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue';
import notifications from '@/variables/notifications';
import { useStore } from '@/store';
import { useToast } from 'vue-toastification';

export default defineComponent({
  name: 'AssetsDetailsList',

  setup() {
    const { getters, dispatch } = useStore();
    const toast = useToast();

    const mintAsset = (assetId: number) => {
      if (getters.accountSMWallet && getters.extensionInfoSMGeneral) {
        dispatch('mintAssetSMWallet', assetId);
      } else {
        toast.error(notifications.connectAccountIsRequired);
      }
    };

    const assetBalancesSorted = computed(() => {
      return [...getters.assetBalancesSMWallet].sort(
        (a, b) => Number(b.totalBalance) - Number(a.totalBalance)
      );
    });

    onMounted(() => {
      console.log('assetBalances >>> ', assetBalancesSorted.value);
    });

    return {
      assetBalancesSorted,
      mintAsset,
    };
  },
});
</script>
