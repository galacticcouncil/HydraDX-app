<template>
  <div class="liquidity">
    <!-- MENU -->
    <div class="menu">
      <label :class="{ selected: actionType === 'add' }">
        <input
          v-model="actionType"
          type="radio"
          name="actionType"
          value="add"
        />ADD</label
      >
      <label :class="{ selected: actionType === 'withdraw' }">
        <input
          v-model="actionType"
          type="radio"
          name="actionType"
          value="withdraw"
        />WITHDRAW</label
      >
    </div>

    <div class="noPools" v-if="!Object.keys(poolInfo).length">
      OH!... NO POOLS ON CHAIN
    </div>
    <div class="liquidityPlatform" v-if="Object.keys(poolInfo).length">
      <!-- POOL LIST -->
      <div class="actionList main">
        <div class="legend inverted">
          <div class="name">SELECT POOL</div>
        </div>
        <div
          class="assetRecord"
          v-for="(pool, poolId) in poolInfo"
          v-bind:key="poolId"
        >
          <div class="listItem">
            <label :class="{ selected: selectedPool === poolId }">
              <input
                v-model="selectedPool"
                type="radio"
                name="selectedPool"
                :value="poolId"
              />
              {{ pool.poolAssetNames[0] }} | {{ pool.poolAssetNames[1] }}
            </label>
          </div>
        </div>
      </div>

      <!-- ADD LIQUIDITY -->
      <div class="actionList add">
        <div class="legend inverted">
          <div class="name">AMOUNT</div>
        </div>
        <div class="params" v-if="selectedPool !== null">
          <div class="spotPrice">
            SPOT PRICE: {{ spotPrice.amountFormatted }}
          </div>
          <div class="walletState">
            <div>
              {{ poolInfo[selectedPool].poolAssetNames[0] }}
              OWNED:
              {{
                assetBalances[poolInfo[selectedPool].poolAssets[0]]
                  .balanceFormatted
              }}
            </div>
            <div>
              {{ poolInfo[selectedPool].poolAssetNames[1] }}
              OWNED:
              {{
                assetBalances[poolInfo[selectedPool].poolAssets[1]]
                  .balanceFormatted
              }}
            </div>
            <div class="shares" v-if="actionType === 'withdraw'">
              SHARE TOKENS OWNED:
              {{
                assetBalances[poolInfo[selectedPool].shareToken]
                  .balanceFormatted
              }}
            </div>
          </div>
          <label class="amount">
            <div v-if="actionType === 'withdraw'">BURN SHARE %:</div>
            <div v-if="actionType === 'add'">
              {{ poolInfo[selectedPool].poolAssetNames[0] }} AMOUNT:
            </div>
            <BalanceInput v-model="liquidityAmount" />
            <div class="computed" v-if="actionType === 'add'">
              {{ poolInfo[selectedPool].poolAssetNames[1] }} AMOUNT:
              {{ spotPrice.amount }}
            </div>
          </label>

          <!-- ADD LIQUIDITY -->
          <button @click="add" class="addButton" v-if="actionType === 'add'">
            ADD
          </button>

          <!-- REMOVE LIQUIDITY -->
          <button
            @click="withdraw"
            class="withdrawButton"
            :disabled="liquidityAmount > 100 || liquidityAmount < 0"
            v-if="actionType === 'withdraw'"
          >
            WITHDRAW
          </button>
        </div>
      </div>
      <!-- TRADES -->
      <div class="actionList trades">
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
import BalanceInput from "./BalanceInput.vue";

export default Vue.extend({
  name: "Head",
  components: { BalanceInput },
  methods: {
    add: function () {
      this.$store.dispatch("addLiquidity");
    },
    withdraw: function () {
      this.$store.dispatch("withdrawLiquidity");
    },
  },
  computed: {
    liquidityAmount: {
      get() {
        return this.$store.state.liquidityAmount;
      },
      set(liquidityAmount) {
        this.$store.commit("setLiquidityAmount", liquidityAmount);
      },
    },
    selectedPool: {
      get() {
        return this.$store.state.selectedPool;
      },
      set(poolId: string) {
        const token1 = this.poolInfo[poolId].poolAssets[0];
        const token2 = this.poolInfo[poolId].poolAssets[1];
        this.$store.commit("setLiquidityProperties", { token1, token2 });
        this.$store.dispatch("getSpotPrice");
        this.$store.dispatch("changeSelectedPool", poolId);
      },
    },
    actionType: {
      get() {
        return this.$store.state.liquidityProperties.actionType;
      },
      set(actionType) {
        this.$store.commit("setLiquidityProperties", { actionType });
        this.$store.dispatch("getSpotPrice");
      },
    },
    ...mapGetters(["poolInfo", "assetBalances", "spotPrice"]),
  },
});
</script>

<style scoped>
.menu label {
  border-color: #5eafe1;
}

.legend {
  padding: 0.5em;
}

.liquidityPlatform {
  display: flex;
}

.actionList.main {
  flex-basis: 30%;
}

.actionList.add {
  flex-basis: 30%;
}

.actionList.trades {
  flex-basis: 40%;
}

.listItem {
  width: 100%;
}

label {
  padding: 0.8em;
  display: block;
  width: 100%;
}

.actionList {
  border-color: #5eafe1;
  border-right-width: 1px;
  border-bottom-width: 15px;
}

.shares {
  padding-top: 1em;
}

.amount {
  text-align: left;
  padding: 10%;
}

.computed {
  color: #aaa;
  padding-top: 0.5em;
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

.liquidity input {
  background-color: transparent;
  font-size: 1em;
  color: #5eafe1;
  border-width: 1px;
  border-color: #5eafe1;
  outline: none;
}

.spotPrice {
  padding-top: 1em;
}

.assetRecord label:hover {
  border-top-width: 1px;
  border-color: #5eafe1;
  box-shadow: 0 0 7px #5eafe1 inset;
}

.menu label:hover,
button:hover {
  box-shadow: 0 0 10px #5eafe1 inset;
}

.walletState {
  padding: 1em;
}
</style>
