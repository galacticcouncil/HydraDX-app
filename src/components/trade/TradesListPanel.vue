<template>
  <CommonPanel class="hdx-trades-panel-container">
    <div class="panel-header">Trades</div>
    <div class="panel-body">
      <div
        v-if="Object.keys(transactionList).length"
        class="transactions-list-container"
      >
        <div
          v-for="({ data: txData }, key) in transactionList"
          :key="key"
          class="transaction-record-container"
        >
          <div
            class="record-short-info"
            @click.prevent="() => onTransactionRecordClick(txData.id)"
          >
            <span
              >{{ txData.intentionType }}
              {{ txData.amount.div('1e12').toString() }}
              {{ assetList[txData.asset1].name }} for
              {{ txData.totalAmountFinal.div('1e12').toString() }}
              {{ assetList[txData.asset2].name }}</span
            >
          </div>
          <div class="record-detailed-info" v-show="openTxRecord === txData.id">
            <div class="details-col left">
              <div class="details-item">
                <div class="title">Fees:</div>
                <div class="value">
                  {{
                    txData.match
                      ? `${txData.totalFeeFinal
                          .div('1e12')
                          .decimalPlaces(6)
                          .toString()} ${assetList[txData.asset2].name}`
                      : '---'
                  }}
                </div>
              </div>
              <div class="details-item">
                <div class="title">Match:</div>
                <div class="value">
                  {{
                    txData.match
                      ? `${txData.match
                          .div('1e12')
                          .decimalPlaces(6)
                          .toString()} ${
                          txData.intentionType === 'BUY'
                            ? assetList[txData.asset1].name
                            : assetList[txData.asset2].name
                        }`
                      : '---'
                  }}
                </div>
              </div>
            </div>
            <div class="details-col right">
              <div class="details-item">
                <div class="title">Slippage:</div>
                <div class="value">
                  {{ txData.slippagePercentage.toString() }} %
                </div>
              </div>
              <div class="details-item">
                <div class="title">Saved:</div>
                <div class="value">
                  {{ txData.saved.decimalPlaces(6).toString() }}
                  {{ assetList[txData.asset2].name }}
                </div>
              </div>
            </div>
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
    const openTxRecord = ref('');

    const transactionLength = computed(() => {
      const txList = getters.transactionListSMTrade;
      return Object.keys(txList).length;
    });
    const transactionList = computed(() => {
      console.log(
        'getters.transactionListSMTrade - ',
        getters.transactionListSMTrade
      );
      return getters.transactionListSMTrade;
    });

    const onTransactionRecordClick = (txId: string) => {
      openTxRecord.value = openTxRecord.value === txId ? '' : txId;
    };

    return {
      assetList: computed(() => getters.assetListSMWallet),
      transactionList,
      isShown,
      transactionLength,
      onTransactionRecordClick,
      openTxRecord,
    };
  },
});
</script>

<style scoped></style>
