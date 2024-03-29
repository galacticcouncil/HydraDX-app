<template>
  <div class="hdx-pools-list-container">
    <div class="pools-list-controls-container">
      <ButtonCommon
        medium
        :on-click="openCreatePoolDialog"
        custom-class="mt-o mb-0 create-pool"
        pd-dapp-required
        >Create pool</ButtonCommon
      >
    </div>

    <div class="hdx-table-container col-num-3" role="table">
      <div class="flex-table header" role="rowgroup">
        <div class="flex-row first" role="columnheader">Pool</div>
        <div class="flex-row" role="columnheader">Market cap</div>
        <div class="flex-row" role="columnheader">My Liquidity</div>
        <!--        <div class="flex-row" role="columnheader">Volume 24h</div>-->
      </div>

      <template v-if="Object.keys(poolsInfo).length">
        <div
          class="flex-table row"
          role="rowgroup"
          v-for="(pool, poolId) in poolsInfo"
          :key="poolId"
          @click.prevent="() => onPoolClick(poolId)"
        >
          <div class="flex-row first" role="cell">
            {{ pool.poolAssetNames[0] }} | {{ pool.poolAssetNames[1] }}
          </div>
          <div class="flex-row" role="cell">
            {{ getPriceDecoratedShort(pool.marketCap) }}
          </div>
          <div class="flex-row" role="cell">
            {{ getUserPoolLiquidity(pool.shareToken) || '---' }}
          </div>
          <!--          <div class="flex-row" role="cell">-&#45;&#45;</div>-->
        </div>
      </template>
      <template v-else>
        <div class="flex-table row" role="rowgroup">
          <div class="flex-row empty-list-notice" role="cell">
            OH!... NO POOLS ON CHAIN
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
import { POOL_CREAT_NEW_POOL_SECTION_PATH } from '@/variables/constants';
import { getPriceDecoratedShort } from '@/services/utils';

export default defineComponent({
  name: 'PoolsList',

  setup() {
    const { getters, commit, dispatch } = useStore();
    const router = useRouter();

    const poolsInfo = computed(() => getters.poolsInfoSMPool);
    const walletAssetBalances = computed(() => getters.assetBalancesSMWallet);
    const liquidityProperties = computed(
      () => getters.liquidityPropertiesSMSinglePool
    );
    const onPoolClick = (poolId: string) => {
      console.log('poolsInfo >>> ', poolsInfo.value);

      const newPoolId = poolId as string;
      const asset1 = poolsInfo.value[newPoolId].poolAssets[0];
      const asset2 = poolsInfo.value[newPoolId].poolAssets[1];

      commit('SET_LIQUIDITY_PROPERTIES__SINGLE_POOL', {
        actionType: liquidityProperties.value.actionType,
        asset1,
        asset2,
      });
      dispatch('getSpotPriceSMTrade');
      dispatch('changeSelectedPoolSMSinglePool', poolId);
      router.push(`/liquidity/${poolId}`);
    };

    const getUserPoolLiquidity = (poolToken: number) => {
      return walletAssetBalances.value[poolToken].totalBalanceFormatted;
    };

    return {
      poolsInfo,
      // selectedPool,
      getUserPoolLiquidity,
      onPoolClick,
      getPriceDecoratedShort,
      openCreatePoolDialog: () =>
        router.push(
          `${router.currentRoute.value.path}#${POOL_CREAT_NEW_POOL_SECTION_PATH}`
        ),
    };
  },
});
</script>

<style scoped></style>
