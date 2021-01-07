<template>
  <div class="main-header">
    <h1>HACK.HYDRA.DX</h1>
    <!-- INFO + LOGO -->
    <div class="headerInfo">
      <div class="logo"></div>
      <div>block #{{ blockInfo.blockNumber }}</div>
      <div v-if="blockInfo.blockHash">
        hash: {{ blockInfo.blockHash.slice(0, 6) }}...{{
          blockInfo.blockHash.slice(-5)
        }}
      </div>
      <div class="accountInfo" v-if="accountInfo">
        Account: {{ accountInfo.name }}
      </div>
    </div>

    <!-- MENU -->
    <nav class="menu">
      <ul>
        <li class="menu-nav-link-wrapper">
          <router-link class="menu-nav-link" to="/trade">TRADE</router-link>
        </li>
        <li class="menu-nav-link-wrapper">
          <router-link class="menu-nav-link" to="/liquidity"
            >LIQUIDITY</router-link
          >
        </li>
        <li class="menu-nav-link-wrapper">
          <router-link class="menu-nav-link" to="/wallet">WALLET</router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from '@/store';

export default defineComponent({
  name: 'Header',
  setup() {
    const { getters, commit } = useStore();

    const onScreenChangeClick = (screen: string) => {
      commit('SET_SCREEN__GENERAL', screen);
    };

    return {
      blockInfo: computed(() => getters.blockInfoSMGeneral),
      accountInfo: computed(() => getters.accountInfoSMWallet),
      onScreenChangeClick,
    };
  },
});
</script>

<style scoped></style>
