<template>
  <div class="hdx-pools-list-container hdx-common-panel-layout">
    <div class="hdx-table-container" role="table" aria-label="Destinations">
      <div class="flex-table header" role="rowgroup">
        <div class="flex-row first" role="columnheader">Pool</div>
        <div class="flex-row" role="columnheader">Market cap</div>
        <div class="flex-row" role="columnheader">My Liquidity</div>
        <div class="flex-row" role="columnheader">Volume 24h</div>
      </div>

      <template v-if="Object.keys(poolInfo).length">
        <div
          class="flex-table row"
          role="rowgroup"
          v-for="(pool, poolId) in poolInfo"
          :key="poolId"
          @click.prevent="() => onPoolClick(poolId)"
        >
          <div class="flex-row first" role="cell">
            {{ pool.poolAssetNames[0] }} | {{ pool.poolAssetNames[1] }}
          </div>
          <div class="flex-row" role="cell">---</div>
          <div class="flex-row" role="cell">
            {{ getUserPoolLiquidity(pool.shareToken) || '---' }}
          </div>
          <div class="flex-row" role="cell">---</div>
        </div>
      </template>
      <template v-else>
        <div class="flex-table row" role="rowgroup">
          <div class="flex-row empty-pools-list-notice" role="cell">
            OH!... NO POOLS ON CHAIN
          </div>
        </div>
      </template>

      <!--      <div class="assetRecord" v-for="(pool, poolId) in poolInfo" :key="poolId">-->
      <!--        <div class="listItem">-->
      <!--          <label :class="{ selected: selectedPool === poolId }">-->
      <!--            <input-->
      <!--              v-model="selectedPool"-->
      <!--              type="radio"-->
      <!--              name="selectedPool"-->
      <!--              :value="poolId"-->
      <!--            />-->
      <!--            {{ pool.poolAssetNames[0] }} | {{ pool.poolAssetNames[1] }}-->
      <!--          </label>-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from '@/store';
import { onBeforeRouteLeave } from 'vue-router';
import get = Reflect.get;

export default defineComponent({
  name: 'PoolsList',

  setup() {
    const { getters, commit, dispatch } = useStore();

    const poolInfo = computed(() => getters.poolInfoSMPool);
    const walletAssetBalances = computed(() => getters.assetBalancesSMWallet);
    const liquidityProperties = computed(
      () => getters.liquidityPropertiesSMPool
    );

    // watch(
    //   () => getters.poolInfoSMPool,
    //   async newVal => {
    //     console.log('poolInfo - ', newVal); //shareToken
    //     if (!newVal) return;
    //     const firstPoolId = Object.keys(newVal)[1];
    //     const poolAmount = await getTokenAmount(
    //       firstPoolId.toString(),
    //       //@ts-ignore
    //       '0'
    //     );
    //     console.log('poolAmount- ', poolAmount)
    //   }
    // );

    // const selectedPool = computed({
    //   get: () => getters.selectedPoolSMPool,
    //   set: poolId => {
    //     const newPoolId = poolId as string;
    //     const asset1 = poolInfo.value[newPoolId].poolAssets[0];
    //     const asset2 = poolInfo.value[newPoolId].poolAssets[1];
    //
    //     commit('SET_LIQUIDITY_PROPERTIES__POOL', {
    //       actionType: liquidityProperties.value.actionType,
    //       asset1,
    //       asset2,
    //     });
    //     dispatch('getSpotPriceSMTrade');
    //     dispatch('changeSelectedPoolSMPool', poolId);
    //   },
    // });

    const onPoolClick = (poolId: string) => {
      const newPoolId = poolId as string;
      const asset1 = poolInfo.value[newPoolId].poolAssets[0];
      const asset2 = poolInfo.value[newPoolId].poolAssets[1];

      console.log('poolId - ', poolId);

      commit('SET_LIQUIDITY_PROPERTIES__POOL', {
        actionType: liquidityProperties.value.actionType,
        asset1,
        asset2,
      });
      dispatch('getSpotPriceSMTrade');
      dispatch('changeSelectedPoolSMPool', poolId);
    };

    onBeforeRouteLeave((to, from, next) => {
      commit('SET_LIQUIDITY_PROPERTIES__POOL', {
        actionType: 'add',
        asset1: null,
        asset2: null,
      });
      dispatch('changeSelectedPoolSMPool', null);
      next();
    });

    const getUserPoolLiquidity = (poolToken: number) => {
      return walletAssetBalances.value[poolToken].balance
        ? +walletAssetBalances.value[poolToken].balance
            .dividedBy('1e12')
            .toFormat()
        : null;
    };

    return {
      poolInfo,
      // selectedPool,
      getUserPoolLiquidity,
      onPoolClick,
    };
  },
});
</script>

<style scoped></style>
