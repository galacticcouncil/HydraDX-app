<template>
  <label class="amount">
    {{ assetList[asset1].name }} TO
    {{ actionType === 'sell' ? 'SELL' : 'BUY' }}
    <BalanceInput v-model="tradeAmount" :options="tradeAmountOptions" />
    <div class="computed">
      {{ assetList[asset2].name }} TO
      {{ actionType === 'sell' ? 'BUY' : 'SELL' }}:
      {{ sellPrice.amountFormatted }}
    </div>
  </label>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from '@/store';

export default defineComponent({
  name: 'TradeAmount',
  components: {},
  setup() {
    const { getters, dispatch } = useStore();

    const tradeAmountOptions = computed(() => {
      if (getters.tradePropertiesSMTrade.asset1) {
        return {
          units:
            getters.assetListSMWallet[+getters.tradePropertiesSMTrade.asset1]
              .name,
        };
      } else return { units: '' };
    });

    const tradeAmount = computed({
      get: () => getters.tradeAmountSMTrade,
      set: tradeAmount => {
        console.log('tradeAmount - ', tradeAmount, typeof tradeAmount);
        dispatch('changeTradeAmountSMTrade', tradeAmount);
      },
    });
    const asset1 = computed(() => getters.tradePropertiesSMTrade.asset1);
    const asset2 = computed(() => getters.tradePropertiesSMTrade.asset2);
    const actionType = computed(
      () => getters.tradePropertiesSMTrade.actionType
    );

    return {
      sellPrice: computed(() => getters.sellPriceSMTrade),
      assetList: computed(() => getters.assetListSMWallet),
      tradeAmountOptions,
      tradeAmount,
      asset1,
      asset2,
      actionType,
    };
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
