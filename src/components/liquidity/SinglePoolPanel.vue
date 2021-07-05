<template>
  <div class="hdx-page-screen-panel-container hdx-single-pool-panel">
    <div class="screen-panel-header">
      <PanelBackButton :on-click="onBackClick" />
      <div class="screen-panel-name" v-if="poolName">
        {{ poolName }}
      </div>
    </div>
    <div class="screen-panel-body">
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
            pd-dapp-required
            >Add Liquidity</ButtonCommon
          >
          <ButtonCommon
            :on-click="() => setActionType('withdraw')"
            :disabled="!userPoolLiquidity"
            custom-class="liquidity-control remove"
            pd-dapp-required
            >Remove liquidity</ButtonCommon
          >
        </div>
      </div>
      <div
        class="liquidity-action-controls"
        v-if="addRemovePoolLiquidityDialogOpen"
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
</template>

<script lang="ts">
type PoolInfo = {
  poolAssets: string[];
  poolAssetNames: string[];
  shareToken: number;
};
import { Ref } from '@vue/reactivity';
import { defineComponent, computed, watch, ref, onMounted } from 'vue';
import { useStore } from '@/store';
import LiquidityControlsPanel from '@/components/liquidity/LiquidityControlsPanel.vue';
import PanelBackButton from '@/components/common/PanelBackButton.vue';
import { useRouter } from 'vue-router';
import * as constants from '@/variables/constants';

export default defineComponent({
  name: 'SinglePoolPanel',
  components: {
    LiquidityControlsPanel,
    PanelBackButton,
  },
  setup() {
    const { getters } = useStore();
    const poolName = ref('');
    const currentPool: Ref<PoolInfo | null> = ref(null);
    const router = useRouter();

    const poolsInfo = computed(() => getters.poolsInfoSMPool);
    const addRemovePoolLiquidityDialogOpen = computed(
      () => getters.addRemovePoolLiquidityDialogOpenSMSinglePool
    );
    const selectedPool = computed(() => getters.selectedPoolSMSinglePool);

    const userPoolLiquidity = computed(() => {
      if (
        currentPool.value === null ||
        getters.assetBalancesSMWallet[currentPool.value.shareToken]
          .balanceFormatted === '0'
      ) {
        return null;
      }

      return getters.assetBalancesSMWallet[currentPool.value.shareToken]
        .balanceFormatted;
    });

    watch(
      () => getters.selectedPoolSMSinglePool,
      (newVal, oldVal) => {
        if (newVal !== oldVal && newVal) {
          currentPool.value = poolsInfo.value[newVal];

        }
        if (newVal !== null && currentPool.value !== null) {
          poolName.value = `${currentPool.value.poolAssetNames[0]} | ${currentPool.value.poolAssetNames[1]}`;
        } else {
          poolName.value = '';
        }
      }
    );

    const setActionType = (actionType: string) => {
      router.push(
        `${router.currentRoute.value.path}#${
          actionType === 'add'
            ? constants.POOL_ADD_LIQUIDITY_SECTION_PATH
            : constants.POOL_REMOVE_LIQUIDITY_SECTION_PATH
        }`
      );
    };

    onMounted(() => {
      if (selectedPool.value) {
        currentPool.value = poolsInfo.value[selectedPool.value];
      }

      if (selectedPool.value !== null && currentPool.value !== null) {
        poolName.value = `${currentPool.value.poolAssetNames[0]} | ${currentPool.value.poolAssetNames[1]}`;
      } else {
        poolName.value = '';
      }
    });

    const onBackClick = () => {
      router.push('/liquidity');
    };

    const onCloseLiquidityActionControlsClick = () => {
      router.push(`${router.currentRoute.value.path}`);
    };

    return {
      poolsInfo,
      userPoolLiquidity,
      addRemovePoolLiquidityDialogOpen,
      onBackClick,
      currentPool,
      poolName,
      setActionType,
      onCloseLiquidityActionControlsClick,
    };
  },
});
</script>

<style scoped></style>
