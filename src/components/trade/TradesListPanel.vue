<template>
  <CommonPanel class="hdx-trades-panel-container">
    <div class="panel-header">Trades</div>
    <div class="panel-body">
      <div
        v-if="Object.keys(transactionList).length"
        class="transactions-list-container"
      >
        <div
          v-for="(tx, key) in transactionList"
          :key="key"
          class="transaction-record-container"
          :class="{ 'tx-failed': isTxFailed(tx) }"
        >
          <div
            class="record-short-info"
            @click.prevent="() => onTransactionRecordClick(tx.data.id)"
          >
            <span
              >{{ tx.data.intentionType }}
              {{ tx.data.amount.toString() }}
              {{ assetList[tx.data.asset1].name }} for
              {{
                tx.data.errorDetails === undefined
                  ? tx.data.totalAmountFinal.toString()
                  : tx.data.totalAmountInitial.toString()
              }}
              {{ assetList[tx.data.asset2].name }}</span
            >
          </div>
          <div
            class="record-detailed-info"
            v-show="openTxRecord === tx.data.id"
          >
            <div class="details-row">
              <div class="details-col left">
                <div class="details-item">
                  <div class="title">Fees:</div>
                  <div class="value">
                    {{
                      tx.data.match
                        ? `${tx.data.totalFeeFinal
                            .decimalPlaces(6)
                            .toString()} ${assetList[tx.data.asset2].name}`
                        : '---'
                    }}
                  </div>
                </div>
                <div class="details-item">
                  <div class="title">Match:</div>
                  <div class="value">
                    {{
                      tx.data.match
                        ? `${tx.data.match.decimalPlaces(6).toString()} ${
                            tx.data.intentionType === 'BUY'
                              ? assetList[tx.data.asset1].name
                              : assetList[tx.data.asset2].name
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
                    {{ tx.data.slippagePercentage.toString() }} %
                  </div>
                </div>
                <div class="details-item">
                  <div class="title">Saved:</div>
                  <div class="value" v-if="!isTxFailed(tx)">
                    {{ tx.data.saved.decimalPlaces(6).toString() }}
                    {{ assetList[tx.data.asset2].name }}
                  </div>
                  <div class="value" v-else>---</div>
                </div>
              </div>
            </div>
            <div class="details-row">
              <div class="details-col">
                <div class="error-details" v-if="isTxFailed(tx)">
                  {{ tx.data.errorDetails.documentation }}
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
      return getters.transactionListSMTrade;
    });

    const onTransactionRecordClick = (txId: string) => {
      openTxRecord.value = openTxRecord.value === txId ? '' : txId;
    };

    const isTxFailed = (transaction: any): boolean => {
      return transaction.status.error && transaction.status.error.length > 0;
    };

    return {
      assetList: computed(() => getters.assetListSMWallet),
      transactionList,
      isShown,
      transactionLength,
      onTransactionRecordClick,
      openTxRecord,
      isTxFailed,
    };
  },
});
</script>

<style scoped></style>
