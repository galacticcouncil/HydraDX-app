<template>
  <CommonPanel class="hdx-trade-controls-panel-container">
    <div class="trade-type-controls-container">
      <div class="trade-action-type-select">
        <ButtonWithStatus
          :on-click="() => setActionType('buy')"
          :active="actionType === 'buy'"
          custom-class="trade-action-type"
          >Buy</ButtonWithStatus
        >
        <ButtonWithStatus
          :on-click="() => setActionType('sell')"
          :active="actionType === 'sell'"
          custom-class="trade-action-type"
          >Sell</ButtonWithStatus
        >
      </div>
    </div>
    <div class="panel-body"></div>
  </CommonPanel>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from '@/store';

export default defineComponent({
  name: 'TradesListPanel',

  setup() {
    const { getters, dispatch } = useStore();

    const setActionType = (actionType: string) => {
      dispatch('changeTradePropertiesSMTrade', {
        asset1: getters.tradePropertiesSMTrade.asset1,
        asset2: getters.tradePropertiesSMTrade.asset2,
        actionType,
      });
    };

    return {
      messages: computed(() => getters.generalLoadingMessagesSMGeneral),
      actionType: computed(() => getters.tradePropertiesSMTrade.actionType),
      setActionType,
    };
  },
});
</script>

<style scoped></style>
