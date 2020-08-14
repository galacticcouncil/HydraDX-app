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
          <label class="amount">
            {{ assetList[token1].name }} TO
            {{ actionType === "sell" ? "SELL" : "BUY" }}
            <input
              type="number"
              class="amountInput"
              v-model="tradeAmount"
              step="any"
            />
            <div class="computed">
              {{ assetList[token2].name }} TO
              {{ actionType === "sell" ? "BUY" : "SELL" }}:
              {{ sellPrice.amountFormatted }}
              <input
                type="number"
                class="amountInput"
                step="any"
                :value="sellPrice.inputAmount"
                disabled
              />
            </div>
          </label>
          <button @click="swap" class="buyButton">{{ actionType }}</button>
        </div>
      </div>

      <!-- TRADES -->
      <div class="actionList trade">
        <div class="legend inverted">
          <div class="name">TRADES</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

export default Vue.extend({
  name: "Trade",
  methods: {
    swap: function() {
      this.$store.dispatch("swap");
    }
  },
  computed: {
    tradeAmount: {
      get() {
        return this.$store.state.tradeAmount.inputAmount;
      },
      set(tradeAmount) {
        this.$store.commit("setTradeAmount", tradeAmount);
      }
    },
    token1: {
      get() {
        return this.$store.state.tradeProperties.token1;
      },
      set(token1) {
        this.$store.commit("setTradeProperties", { token1, token2: null });
      }
    },
    token2: {
      get() {
        return this.$store.state.tradeProperties.token2;
      },
      set(token2) {
        this.$store.commit("setTradeProperties", { token2 });
      }
    },
    actionType: {
      get() {
        return this.$store.state.tradeProperties.actionType;
      },
      set(actionType) {
        this.$store.commit("setTradeProperties", { actionType });
      }
    },
    ...mapGetters([
      "poolInfo",
      "assetList",
      "tokenTradeMap",
      "assetBalances",
      "spotPrice",
      "sellPrice"
    ])
  }
});
</script>

<style scoped>
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

.actionList {
  border-color: #5eafe1;
  border-right-width: 1px;
  border-bottom-width: 15px;
}

.actionList.main,
.actionList.secondary {
  flex-basis: 20%;
}

.actionList.trade {
  flex-basis: 30%;
}

.assetRecord .listItem {
  width: 100%;
}

label {
  padding: 1em;
  display: block;
  width: 100%;
}

.trade input {
  background-color: transparent;
  color: #5eafe1;
  border-width: 1px;
  font-size: 1em;
  border-color: #5eafe1;
  outline: none;
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
  padding: 0;
  margin-left: 10%;
}

.amountInput {
  width: 80%;
  text-align: right;
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
