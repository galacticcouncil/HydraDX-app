<template>
  <label class="amount">
    {{ assetList[asset1].name }} TO
    {{ actionType === "sell" ? "SELL" : "BUY" }}
    <BalanceInput v-model="tradeAmount" :options="tradeAmountOptions" />
    <div class="computed">
      {{ assetList[asset2].name }} TO
      {{ actionType === "sell" ? "BUY" : "SELL" }}:
      {{ sellPrice.amountFormatted }}
    </div>
  </label>
</template>

<script lang="ts">
import Vue from "../vue-typed/vue-typed";
import { mapGetters } from "vuex";
import BalanceInput from "./BalanceInput.vue";

export default Vue.extend({
  name: "TradeAmount",
  components: { BalanceInput },
  computed: {
    tradeAmountOptions: {
      get() {
        if (this.$store.state.tradeProperties.asset1) {
          return {
            units: this.assetList[this.$store.state.tradeProperties.asset1]
              .name,
          };
        } else return { units: "" };
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
    asset1: {
      get() {
        return this.$store.state.tradeProperties.asset1;
      },
    },
    asset2: {
      get() {
        return this.$store.state.tradeProperties.asset2;
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
