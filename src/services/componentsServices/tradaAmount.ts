import { useStore } from '@/store';
import { computed } from 'vue';
import * as BN from 'bn.js';

const { getters, dispatch } = useStore();

export const tradeAmountOptions = computed(() => {
  if (getters.tradePropertiesSMTrade.asset1) {
    return {
      units:
        getters.assetListSMWallet[+getters.tradePropertiesSMTrade.asset1].name,
    };
  } else return { units: '' };
});

export const tradeAmount = computed(() => getters.tradeAmountSMTrade);

export const setTradeAmount = (tradeAmount: BN) => {
  dispatch('changeTradeAmountSMTrade', tradeAmount);
};
