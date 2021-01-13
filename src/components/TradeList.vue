<template>
  <!-- TRADES -->
  <div class="actionList transaction" v-bind:class="{ isShown: isShown }">
    <div class="legend inverted">
      <button @click="isShown = !isShown">
        <div class="name">
          {{ isShown ? '↓' : '↑' }} TRADES {{ transactionLength }}
          {{ isShown ? '↓' : '↑' }}
        </div>
      </button>
    </div>
    <div class="transactionData">
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
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useStore } from '@/store';

export default defineComponent({
  name: 'Trade',
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

<style scoped>
.legend {
  padding: 0.5em;
}

.actionList.transaction.isShown {
  top: 0;
  height: 100%;
  border-bottom-width: 15px;
}

.actionList.transaction {
  position: absolute;
  top: calc(100% - 15px);
  height: auto;
  background: #0d106e;
  width: 100%;

  border-color: #5eafe1;
  border-right-width: 1px;
  border-bottom-width: 0px;
}

.assetRecord .listItem {
  width: 100%;
}

button {
  font-size: 1em;
}

.transactionData {
  display: none;
}

.isShown .transactionData {
  display: initial;
}

.transactionRecord {
  text-transform: uppercase;
  text-align: left;
  padding: 0.7em 0.5em 0 0.5em;
}

.transactionRecord::before {
  content: ' ';
  display: inline-block;
  font-size: 0.8em;
  width: 1em;
  height: 1em;
  border-radius: 0.5em;
  vertical-align: middle;
}

.p0::before {
  background-color: #444;
}

.p1::before {
  background-color: #aaa;
}

.p2::before {
  background-color: royalblue;
}

.p3::before {
  background-color: green;
}

.p4::before {
  background-color: red;
}

.p5::before {
  background-color: #777;
}
</style>
