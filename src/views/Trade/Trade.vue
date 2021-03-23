<template>
  <div class="page-wrapper trade">
    <div class="hdx-common-panels-container">
      <TradesListPanel />
      <TradeControlsPanel />
    </div>
    <div v-if="true">
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

      <div class="noPools" v-if="!Object.entries(tokenTradeMap).length">
        AWWW... NO POOLS TO TRADE
      </div>

      <div class="tradePlatform" v-if="Object.entries(tokenTradeMap).length">
        <!-- ASSET 1 -->
        <div class="actionList main">
          <div class="legend inverted">
            <div class="name">{{ actionType }} TOKEN</div>
          </div>
          <AssetList v-model="asset1" :assetList="asset1List" name="asset1" />
        </div>

        <!-- ASSET 2 -->
        <div class="actionList secondary">
          <div class="legend inverted">
            <div class="name">FOR TOKEN</div>
          </div>
          <AssetList
            v-show="asset1 !== null"
            v-model="asset2"
            :assetList="asset2List"
            name="asset2"
          />
        </div>

        <!-- TRADE PARAMS -->
        <div class="actionList trade">
          <div class="legend inverted">
            <div class="name">AMOUNT</div>
          </div>
          <div class="params" v-if="asset2 !== null">
            <div class="spotPrice">
              SPOT PRICE: {{ spotPrice.amountFormatted }}
            </div>
            <div class="walletState">
              <div>
                {{ assetList[asset1].name }}
                OWNED:
                {{ assetBalances[asset1].balanceFormatted }}
              </div>
              <div>
                {{ assetList[asset2].name }}
                OWNED:
                {{ assetBalances[asset2].balanceFormatted }}
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
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useStore } from '@/store';
import { useRouter } from 'vue-router';

import TradesListPanel from '@/components/transactions/TradesListPanel.vue';
import TradeControlsPanel from '@/components/transactions/TradeControlsPanel.vue';

import TradeList from '@/components/TradeList.vue';
import TradeAmount from '@/components/TradeAmount.vue';
import AssetList from '@/components/AssetList.vue';
import notifications from '@/variables/notifications';
import { useToast } from 'vue-toastification';

export default defineComponent({
  name: 'Trade',
  components: {
    TradeList,
    TradeAmount,
    AssetList,
    TradesListPanel,
    TradeControlsPanel,
  },

  setup() {
    const { getters, dispatch } = useStore();
    const router = useRouter();
    const toast = useToast();

    const asset1 = computed({
      get: () => getters.tradePropertiesSMTrade.asset1,
      set: asset1 => {
        dispatch('changeTradePropertiesSMTrade', {
          asset1,
          asset2: null,
          actionType: getters.tradePropertiesSMTrade.actionType,
        });
      },
    });

    const asset2 = computed({
      get: () => getters.tradePropertiesSMTrade.asset2,
      set: asset2 => {
        dispatch('changeTradePropertiesSMTrade', {
          asset2,
          asset1: getters.tradePropertiesSMTrade.asset1,
          actionType: getters.tradePropertiesSMTrade.actionType,
        });
      },
    });
    const actionType = computed({
      get: () => getters.tradePropertiesSMTrade.actionType,
      set: actionType => {
        dispatch('changeTradePropertiesSMTrade', {
          asset1: getters.tradePropertiesSMTrade.asset1,
          asset2: getters.tradePropertiesSMTrade.asset2,
          actionType,
        });
      },
    });

    const asset1List = computed(() => {
      return getters.assetListSMWallet.filter(
        element =>
          Object.keys(getters.tokenTradeMapSMTrade).findIndex(
            assetId => parseInt(assetId) === element.assetId
          ) >= 0
      );
    });

    const asset2List = computed(() => {
      return getters.assetListSMWallet.filter(element => {
        // const asset1 = asset1 as number | null;
        if (asset1.value) {
          return (
            getters.tokenTradeMapSMTrade[+asset1.value].findIndex(
              assetId => assetId === element.assetId
            ) >= 0
          );
        } else return false;
      });
    });

    const swap = () => {
      if (getters.accountSMWallet && getters.extensionInfoSMGeneral) {
        dispatch('swapSMTrade');
      } else {
        toast.error(notifications.connectAccountIsRequired);
        router.push('/wallet');
      }
    };

    return {
      poolInfo: computed(() => getters.poolInfoSMPool),
      assetList: computed(() => getters.assetListSMWallet),
      tokenTradeMap: computed(() => getters.tokenTradeMapSMTrade),
      assetBalances: computed(() => getters.assetBalancesSMWallet),
      spotPrice: computed(() => getters.spotPriceSMTrade),
      sellPrice: computed(() => getters.sellPriceSMTrade),
      asset1,
      asset2,
      actionType,
      asset1List,
      asset2List,
      swap,
    };
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
  content: ' ';
  display: inline-block;
  font-size: 0.8em;
  width: 1em;
  height: 1em;
  border-radius: 0.5em;
  vertical-align: middle;
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
