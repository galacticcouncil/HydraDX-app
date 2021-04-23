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
          {{ assetRecord.balanceFormatted }}
        </div>
        <div class="flex-row" role="cell">---</div>
        <div class="flex-row" role="cell">---</div>
        <div class="flex-row" role="cell">
          <ButtonCommon
            small
            :on-click="() => mintAsset(assetRecord.assetId)"
            custom-class="mt-0 mb-0"
            >GET</ButtonCommon
          >
        </div>
      </div>
    </div>
  </PagePanelLayout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
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

    const assetBalancesSorted = computed(() =>
      [...getters.assetBalancesSMWallet].sort(
        (a, b) => Number(b.balance) - Number(a.balance)
      )
    );

    return {
      assetBalancesSorted,
      mintAsset,
    };
  },
});
</script>
