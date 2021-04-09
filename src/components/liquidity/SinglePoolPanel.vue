<template>
  <div class="hdx-single-pool-panel-container hdx-common-panel-layout">
    <div class="hdx-single-pool-panel">
      <div class="pool-panel-header">
        <a href="#" class="back-btn" @click.prevent="onBackClick">
          <img :src="backBtnIcon" alt="Back" />
        </a>
        <div class="pool-name" v-if="poolName">
          {{ poolName }}
        </div>
      </div>
      <div class="pool-panel-body">
        <div class="pool-meta-data-panel">
          <div class="meta-data-item">
            <div class="item-value">120$ M</div>
            <div class="item-name">Liquidity</div>
          </div>
          <div class="meta-data-item">
            <div class="item-value">3.3$ M</div>
            <div class="item-name">Volume (24h)</div>
          </div>
          <div class="meta-data-item">
            <div class="item-value">{{ userPoolLiquidity || '---' }}</div>
            <div class="item-name">My pool share</div>
          </div>
          <div class="meta-data-item pool-controls">
            <ButtonCommon
              :on-click="() => setActionType('add')"
              custom-class="liquidity-control add"
              >Add Liquidity</ButtonCommon
            >
            <ButtonCommon
              :on-click="() => setActionType('withdraw')"
              :disabled="!userPoolLiquidity"
              custom-class="liquidity-control remove"
              >Remove liquidity</ButtonCommon
            >
          </div>
        </div>
        <div
          class="liquidity-action-controls"
          v-if="openLiquidityActionControls"
        >
          <ButtonCommon
            :on-click="onCloseLiquidityActionControlsClick"
            custom-class="close-liquidity-action-controls-btn"
            >Close</ButtonCommon
          >
          <div class="hdx-common-panels-container built-in-panels">
            <LiquidityControlsPanel :current-pool="currentPool" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
type PoolInfo = {
  poolAssets: string[];
  poolAssetNames: string[];
  shareToken: number;
};
import { Ref } from '@vue/reactivity';
import { defineComponent, computed, watch, ref } from 'vue';
import { useStore } from '@/store';
import { getTokenAmount } from '@/services/utils';
import LiquidityControlsPanel from '@/components/liquidity/LiquidityControlsPanel.vue';

export default defineComponent({
  name: 'PoolsList',
  components: {
    LiquidityControlsPanel,
  },
  setup() {
    const { getters, commit, dispatch } = useStore();
    const poolName = ref('');
    const currentPool: Ref<PoolInfo | null> = ref(null);
    const openLiquidityActionControls = ref(false);

    const poolInfo = computed(() => getters.poolInfoSMPool);
    const liquidityProperties = computed(
      () => getters.liquidityPropertiesSMPool
    );

    const userPoolLiquidity = computed(() => {
      if (
        currentPool.value === null ||
        getters.assetBalancesSMWallet[currentPool.value.shareToken]
          .balanceFormatted === '0'
      ) {
        return null;
      }

      return getters.assetBalancesSMWallet[currentPool.value.shareToken]
        .balance.dividedBy('1e12').toFormat();
    });

    watch(
      () => getters.selectedPoolSMPool,
      (newVal, oldVal) => {
        if (newVal !== oldVal && newVal) {
          currentPool.value = poolInfo.value[newVal];
          console.log('--------poolInfo.value[newVal]', poolInfo.value[newVal])
        }
      }
    );

    watch(
      () => getters.selectedPoolSMPool,
      newVal => {
        if (newVal !== null && currentPool.value !== null) {
          poolName.value = `${currentPool.value.poolAssetNames[0]} | ${currentPool.value.poolAssetNames[1]}`;
        } else {
          poolName.value = '';
        }
      }
    );

    const setActionType = (actionType: string) => {
      commit('SET_LIQUIDITY_PROPERTIES__POOL', {
        asset1: liquidityProperties.value.asset1,
        asset2: liquidityProperties.value.asset2,
        actionType,
      });
      dispatch('getSpotPriceSMTrade');
      openLiquidityActionControls.value = true;
    };

    // console.log('getters.selectedPoolSMPool - ', getters.selectedPoolSMPool);

    // watch(
    //   () => getters.poolInfoSMPool,
    //   async newVal => {
    //     console.log('poolInfo - ', newVal); //shareToken
    //     if (!newVal) return;
    //     const firstPoolId = Object.keys(newVal)[0];
    //     const poolAmount = await getTokenAmount(
    //       firstPoolId.toString(),
    //       //@ts-ignore
    //       '0'
    //     );
    //     console.log('firstPoolId- ', firstPoolId);
    //     console.log('poolAmount- ', poolAmount);
    //   }
    // );

    const onBackClick = () => {
      commit('SET_LIQUIDITY_PROPERTIES__POOL', {
        actionType: '',
        asset1: null,
        asset2: null,
      });
      dispatch('changeSelectedPoolSMPool', null);
      openLiquidityActionControls.value = false;
    };

    const onCloseLiquidityActionControlsClick = () => {
      openLiquidityActionControls.value = false;
    };

    return {
      poolInfo,
      userPoolLiquidity,
      onBackClick,
      currentPool,
      poolName,
      setActionType,
      openLiquidityActionControls,
      onCloseLiquidityActionControlsClick,
      backBtnIcon: require('@/assets/images/reply.svg'),
    };
  },
});
</script>

<style scoped></style>
