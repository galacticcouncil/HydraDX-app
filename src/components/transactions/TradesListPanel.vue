<template>
  <CommonPanel class="hdx-trades-panel-container">
    <div class="panel-header">Trades</div>
    <div class="panel-body">
      <div v-if="transactionList.length" class="empty-list-notice">
        <div v-for="(transaction, key) in transactionList" :key="key">
          <div
            v-if="transaction.tokenIn != null && transaction.tokenOut != null"
            :class="`transactionRecord p${transaction.progress}`"
          >
            {{ transaction.type }} {{ transaction.amountIn }}
            {{ assetList[transaction.tokenIn].name }} FOR
            {{ transaction.expectedOut }}
            {{ assetList[transaction.tokenOut].name }}
          </div>
        </div>
      </div>
      <div v-else class="full-panel-notice">
        <span>Empty</span>
      </div>
    </div>
  </CommonPanel>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useStore } from '@/store';

export default defineComponent({
  name: 'TradesListPanel',

  setup() {
    const { getters } = useStore();
    const isShown = ref(false);
    const transactionLength = computed(() => {
      const txList = getters.transactionListSMTrade;
      return Object.keys(txList).length;
    });

    return {
      assetList: computed(() => getters.assetListSMWallet),
      transactionList: computed(() => getters.transactionListSMTrade),
      isShown,
      transactionLength,
    };
  },
});
</script>

<style scoped></style>
