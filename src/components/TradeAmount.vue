<template>
  <label class="amount">
    {{ assetList[token1].name }} TO
    {{ actionType === "sell" ? "SELL" : "BUY" }}
    <BalanceInput v-model="tradeAmount" :options="tradeAmountOptions" />
    <div class="computed">
      {{ assetList[token2].name }} TO
      {{ actionType === "sell" ? "BUY" : "SELL" }}:
      {{ sellPrice.amountFormatted }}
    </div>
  </label>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import BalanceInput from "./BalanceInput.vue";

export default Vue.extend({
  name: "TradeAmount",
  components: { BalanceInput },
  computed: {
    tradeAmountOptions: {
      get() {
        return {
          units: this.assetList[this.$store.state.tradeProperties.token1].name,
        };
      },
    },
    tradeAmount: {
      get() {
        return this.$store.state.tradeAmount;
      },
      set(tradeAmount) {
        this.$store.dispatch("changeTradeAmount", tradeAmount);
      },
    },
    token1: {
      get() {
        return this.$store.state.tradeProperties.token1;
      },
    },
    token2: {
      get() {
        return this.$store.state.tradeProperties.token2;
      },
    },
    actionType: {
      get() {
        return this.$store.state.tradeProperties.actionType;
      },
    },
    ...mapGetters(["assetList", "sellPrice"]),
  },
});
</script>

<style scoped>
label {
  padding: 1em;
  display: block;
  width: 100%;
}

.amount {
  text-align: left;
  padding: 0 10%;
}
</style>
