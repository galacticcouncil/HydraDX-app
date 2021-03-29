<template>
  <div class="page-wrapper liquidity">
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
      <label :class="{ selected: actionType === 'create' }">
        <input
          v-model="actionType"
          type="radio"
          name="actionType"
          value="create"
        />CREATE</label
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
          :key="poolId"
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
              {{ spotPrice.amountFormatted }}
            </div>
          </label>

          <!-- ADD LIQUIDITY -->
          <button
            @click.prevent="addLiquidity"
            class="addButton"
            v-if="actionType === 'add'"
          >
            ADD
          </button>

          <!-- REMOVE LIQUIDITY -->
          <button
            @click.prevent="withdrawLiquidity"
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
import BalanceInput from '@/components/BalanceInput.vue';

import { defineComponent, computed, onMounted } from 'vue';
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import notifications from '@/variables/notifications';

export default defineComponent({
  name: 'Liquidity',
  components: { BalanceInput },
  setup() {
    const { getters, commit, dispatch } = useStore();
    const router = useRouter();
    const toast = useToast();

    const addLiquidity = () => {
      if (getters.accountSMWallet && getters.extensionInfoSMGeneral) {
        dispatch('addLiquiditySMPool');
      } else {
        toast.error(notifications.connectAccountIsRequired);
        router.push('/wallet');
      }
    };

    const withdrawLiquidity = () => {
      dispatch('withdrawLiquiditySMPool');
    };

    // --- Computed ---
    const poolInfo = computed(() => getters.poolInfoSMPool);
    const liquidityProperties = computed(
      () => getters.liquidityPropertiesSMPool
    );
    const selectedPool = computed({
      get: () => getters.selectedPoolSMPool,
      set: poolId => {
        const newPoolId = poolId as string;
        const asset1 = poolInfo.value[newPoolId].poolAssets[0];
        const asset2 = poolInfo.value[newPoolId].poolAssets[1];

        commit('SET_LIQUIDITY_PROPERTIES__POOL', {
          actionType: liquidityProperties.value.actionType,
          asset1,
          asset2,
        });
        dispatch('getSpotPriceSMTrade');
        dispatch('changeSelectedPoolSMPool', poolId);
      },
    });

    const liquidityAmount = computed({
      get: () => getters.liquidityAmountSMPool,
      set: liquidityAmount => {
        console.log('liquidityAmount - ', liquidityAmount);
        commit('SET_LIQUIDITY_AMOUNT__POOL', liquidityAmount);
      },
    });
    const actionType = computed({
      get: () => getters.liquidityPropertiesSMPool.actionType,
      set: (actionType: string) => {
        commit('SET_LIQUIDITY_PROPERTIES__POOL', {
          asset1: liquidityProperties.value.asset1,
          asset2: liquidityProperties.value.asset2,
          actionType,
        });
        dispatch('getSpotPriceSMTrade');
      },
    });

    return {
      assetBalances: computed(() => getters.assetBalancesSMWallet),
      spotPrice: computed(() => getters.spotPriceSMTrade),
      liquidityAmount,
      selectedPool,
      actionType,
      poolInfo,
      addLiquidity,
      withdrawLiquidity,
    };
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
  background-color: #0c36a1;
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
