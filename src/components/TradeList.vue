<template>
  <!-- TRADES -->
  <div class="actionList transaction">
    <div class="legend inverted">
      <div class="name">TRADES</div>
    </div>
    <div v-for="transaction in transactionList" v-bind:key="transaction.id">
      <div
        v-if="transaction.tokenIn != null && transaction.tokenOut != null"
        v-show="transaction.progress < 5"
        :class="'transactionRecord p' + transaction.progress"
      >
        {{ transaction.type }} {{ transaction.amountIn }}
        {{ assetList[transaction.tokenIn].name }} FOR
        {{ transaction.expectedOut }}
        {{ assetList[transaction.tokenOut].name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

export default Vue.extend({
  name: "Trade",
  computed: {
    ...mapGetters(["assetList", "transactionList"]),
  },
});
</script>

<style scoped>
.legend {
  padding: 0.5em;
}

.actionList {
  border-color: #5eafe1;
  border-right-width: 1px;
  border-bottom-width: 15px;
}

.actionList.transaction {
  flex-basis: 30%;
}

.assetRecord .listItem {
  width: 100%;
}

.transactionRecord {
  text-transform: uppercase;
  text-align: left;
  padding: 0.7em 0.5em 0 0.5em;
}

.transactionRecord::before {
  content: " ";
  display: inline-block;
  font-size: 0.8em;
  width: 1em;
  height: 1em;
  border-radius: 0.5em;
  vertical-align: middle;
}

.p0::before {
  background-color: #666;
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
</style>
