<template>
  <div class="trade">
    <!-- MENU -->
    <div class="menu">
      <label :class="{ selected: actionType === 'buy' }">
        <input
          v-model="actionType"
          type="radio"
          name="actionType"
          value="buy"
        />BUY</label
      >
      <label :class="{ selected: actionType === 'sell' }">
        <input
          v-model="actionType"
          type="radio"
          name="actionType"
          value="sell"
        />SELL</label
      >
    </div>

    <div class="noPools" v-if="!tokenTradeMap.length">
      AWWW... NO POOLS TO TRADE
    </div>
    <div class="tradePlatform" v-if="tokenTradeMap.length">
      <!-- ASSET 1 -->
      <div class="actionList main">
        <div class="legend inverted">
          <div class="name">{{ actionType }} TOKEN</div>
        </div>
        <div
          class="assetRecord"
          v-for="(tradableAssets, key) in tokenTradeMap"
          v-bind:key="key"
          v-show="tradableAssets"
        >
          <div class="listItem">
            <label :class="{ selected: token1 === key }">
              <input v-model="token1" type="radio" name="token1" :value="key" />
              {{ assetList[key].name }}
            </label>
          </div>
        </div>
      </div>

      <!-- ASSET 2 -->
      <div class="actionList secondary">
        <div class="legend inverted">
          <div class="name">FOR TOKEN</div>
        </div>
        <div
          class="assetRecord"
          v-for="assetId in tokenTradeMap[token1]"
          v-bind:key="assetId"
          v-show="token1 !== null"
        >
          <div class="listItem">
            <label :class="{ selected: token2 === assetId }">
              <input
                v-model="token2"
                type="radio"
                name="token2"
                :value="assetId"
              />
              {{ assetList[assetId].name }}
            </label>
          </div>
        </div>
      </div>

      <!-- TRADE PARAMS -->
      <div class="actionList trade">
        <div class="legend inverted">
          <div class="name">AMOUNT</div>
        </div>
        <div class="params" v-if="token2 !== null">
          <div class="spotPrice">
            SPOT PRICE: {{ spotPrice.amountFormatted }}
          </div>
          <div class="walletState">
            <div>
              {{ assetList[token1].name }}
              OWNED:
              {{ assetBalances[token1].balanceFormatted }}
            </div>
            <div>
              {{ assetList[token2].name }}
              OWNED:
              {{ assetBalances[token2].balanceFormatted }}
            </div>
          </div>
          <TradeAmount />
          <button @click="swap" class="buyButton">{{ actionType }}</button>
        </div>
      </div>
    </div>
    <!-- TRADES -->
    <TradeList />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

import TradeList from "./TradeList.vue";
import TradeAmount from "./TradeAmount.vue";

export default Vue.extend({
  name: "Trade",
  methods: {
    swap: function () {
      this.$store.dispatch("swap");
    },
  },
  components: { TradeList, TradeAmount },
  computed: {
    token1: {
      get() {
        return this.$store.state.tradeProperties.token1;
      },
      set(token1) {
        this.$store.dispatch("changeTradeProperties", { token1, token2: null });
      },
    },
    token2: {
      get() {
        return this.$store.state.tradeProperties.token2;
      },
      set(token2) {
        this.$store.dispatch("changeTradeProperties", { token2 });
      },
    },
    actionType: {
      get() {
        return this.$store.state.tradeProperties.actionType;
      },
      set(actionType) {
        this.$store.dispatch("changeTradeProperties", { actionType });
      },
    },
    ...mapGetters([
      "poolInfo",
      "assetList",
      "tokenTradeMap",
      "assetBalances",
      "spotPrice",
      "sellPrice",
    ]),
  },
});
</script>

<style scoped>
.actionList {
  border-color: #5eafe1;
  border-right-width: 1px;
  border-bottom-width: 15px;
}

.actionList.main,
.actionList.secondary {
  flex-basis: 30%;
}

.actionList.trade {
  flex-basis: 70%;
}

.tradePlatform {
  display: flex;
}

.legend {
  padding: 0.5em;
}

.menu label {
  border-color: #5eafe1;
}

.menu label:hover,
button:hover {
  box-shadow: 0 0 10px #5eafe1 inset;
}

.assetRecord .listItem {
  width: 100%;
}

label {
  padding: 1em;
  display: block;
  width: 100%;
}

.trade {
  position: relative;
}

.trade input {
  background-color: transparent;
  color: #5eafe1;
  border-width: 1px;
  font-size: 1em;
  border-color: #5eafe1;
  outline: none;
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

.assetRecord label:hover {
  border-top-width: 1px;
  border-color: #5eafe1;
  box-shadow: 0 0 7px #5eafe1 inset;
}

.assetRecord input {
  margin: 0;
}

.amount {
  text-align: left;
  padding: 0 10%;
}

.spotPrice {
  padding-top: 1em;
}

.walletState {
  padding: 1em;
}

button {
  outline: none;
  border-width: 1px;
  border-color: #5eafe1;
  width: 80%;
  height: 3em;
  padding: 1em;
  font-size: 1em;
  background: transparent;
  text-decoration: underline;
  color: #5eafe1;
  margin: 1em;
}
</style>
