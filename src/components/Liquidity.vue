<template>
  <div class="liquidity">
    <!-- MENU -->
    <div class="menu">
      <label :class="{ selected: liquidityAction === 'add' }">
        <input
          v-model="liquidityAction"
          type="radio"
          name="liquidityAction"
          value="add"
        />ADD</label
      >
      <label :class="{ selected: liquidityAction === 'remove' }">
        <input
          v-model="liquidityAction"
          type="radio"
          name="liquidityAction"
          value="remove"
        />REMOVE</label
      >
    </div>

    <div class="liquidityPlatform">
      <!-- POOL LIST -->
      <div class="actionList main">
        <div class="legend inverted">
          <div class="name">SELECT POOL</div>
        </div>
        <div
          class="assetRecord"
          v-for="(pool, poolId) in poolInfo"
          v-bind:key="poolId"
          v-show="Object.keys(poolInfo).length"
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
          <!-- <div class="spotPrice">SPOT PRICE: {{ spotPrice }}</div> -->
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
          </div>
          <label class="amount">
            ADD AMOUNT:
            <input type="number" v-model="addAmount" step="any" />
          </label>
          <!-- <div>EXPECTED PRICE {{ tradePrice.priceFormatted }}</div> -->
          <button @click="add" class="addButton">ADD LIQUIDITY</button>
        </div>
      </div>

      <!-- REMOVE LIQUIDITY -->
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

export default Vue.extend({
  name: "Head",
  methods: {
    add: function() {
      //
    }
  },
  data: () => {
    return {
      addAmount: 0,
      liquidityAction: "add",
      selectedPool: null
    };
  },
  computed: mapGetters(["poolInfo", "assetBalances"])
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

.menu label:hover,
button:hover {
  box-shadow: 0 0 10px #5eafe1 inset;
}

.walletState {
  padding: 1em;
}
</style>
