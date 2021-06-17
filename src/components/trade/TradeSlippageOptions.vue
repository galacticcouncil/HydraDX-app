<template>
  <div class="trade-slippage-options-container">
    <div class="trade-slippage-options-title">slippage tolerance</div>
    <div class="trade-slippage-options-list">
      <div
        v-for="(option, index) in slippageOptionsList"
        :key="index"
        class="trade-slippage-item"
        @click.prevent="() => onOptionClick(option)"
        :class="{ selected: slippageValue === option }"
      >
        {{ option }}%
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import { useStore } from '@/store';
import BigNumber from 'bignumber.js';

export default defineComponent({
  name: 'TradeSlippageOptions',

  setup() {
    const { getters, commit } = useStore();
    const slippageOptionsList = ref([0.5, 1, 1.5, 2]);

    const slippageValue = computed(() =>
      getters.tradeSlippagePercentageSMTrade.toNumber()
    );

    onMounted(() => {
      try {
        const savedSlippageVal = window.localStorage.getItem('tradeSlippage');
        if (
          !savedSlippageVal ||
          !slippageOptionsList.value.includes(
            new BigNumber(savedSlippageVal).toNumber()
          )
        )
          return;

        commit(
          'SET_TRADE_SLIPPAGE_PERCENTAGE__TRADE',
          new BigNumber(savedSlippageVal)
        );
      } catch (e) {
        console.log(e);
      }
    });

    const onOptionClick = (optionVal: number): void => {
      commit('SET_TRADE_SLIPPAGE_PERCENTAGE__TRADE', new BigNumber(optionVal));
      try {
        window.localStorage.setItem('tradeSlippage', optionVal.toString());
      } catch (e) {
        console.log(e);
      }
    };

    return {
      slippageOptionsList,
      onOptionClick,
      slippageValue,
    };
  },
});
</script>

<style scoped></style>
