<template>
  <header class="main-header">
    <div class="main-header-inner">
      <div class="header-logo-container">
        <router-link class="logo-link" to="/">
          <div class="logo"></div>
          <p>HACK.HYDRA.DX</p>
        </router-link>
      </div>

      <div class="header-content-container">
        <nav class="main-navigation">
          <LinkWithStatus to="/trade" customClass="main-navigation-item"
            >Trade</LinkWithStatus
          >
          <LinkWithStatus to="/liquidity" customClass="main-navigation-item"
            >Liquidity</LinkWithStatus
          >
          <LinkWithStatus to="/wallet" customClass="main-navigation-item"
            >Wallet</LinkWithStatus
          >
        </nav>
        <div class="header-info-container">
          <div class="chain-info">
            <div class="block-number">block #{{ blockInfo.blockNumber }}</div>
            <div v-if="blockInfo.blockHash" class="block-hash">
              hash: {{ blockHashShort }}
            </div>
          </div>
          <HeaderAccountsControlPanel />
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from '@/store';
import HeaderAccountsControlPanel from '@/components/wallet/HeaderAccountsControlPanel.vue';

export default defineComponent({
  name: 'Header',
  components: {
    HeaderAccountsControlPanel,
  },
  setup() {
    const { getters, commit } = useStore();

    const onScreenChangeClick = (screen: string) => {
      commit('SET_SCREEN__GENERAL', screen);
    };

    const blockInfo = computed(() => getters.blockInfoSMGeneral);

    const blockHashShort = computed(() => {
      if (!blockInfo.value.blockHash) return '';
      return `${blockInfo.value.blockHash.slice(
        0,
        6
      )}...${blockInfo.value.blockHash.slice(-5)}`;
    });

    return {
      accountInfo: computed(() => getters.accountInfoSMWallet),
      blockInfo,
      blockHashShort,
      onScreenChangeClick,
    };
  },
});
</script>

<style scoped></style>
