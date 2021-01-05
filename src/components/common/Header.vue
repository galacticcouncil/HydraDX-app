<template>
  <div class="header">
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
    <div class="menu">
      <label :class="{ selected: currentScreen === 'trade' }">
        <input
          @change.prevent="() => onScreenChangeClick('trade')"
          type="radio"
          name="screen"
          value="trade"
        />TRADE</label
      >
      <label :class="{ selected: currentScreen === 'liquidity' }">
        <input
          @change.prevent="() => onScreenChangeClick('liquidity')"
          type="radio"
          name="screen"
          value="liquidity"
        />LIQUIDITY</label
      >
      <label :class="{ selected: currentScreen === 'wallet' }">
        <input
          @change.prevent="() => onScreenChangeClick('wallet')"
          type="radio"
          name="screen"
          value="wallet"
        />WALLET</label
      >
    </div>
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
      currentScreen: computed(() => getters.currentScreenSMGeneral),
      blockInfo: computed(() => getters.blockInfoSMGeneral),
      accountInfo: computed(() => getters.accountInfoSMWallet),
      onScreenChangeClick,
    };
  },
});
</script>

<style scoped>
h1 {
  margin: 0.5em 0 0 0;
}

.headerInfo {
  width: 100%;
  height: 2.8em;
}

.headerInfo div {
  vertical-align: middle;
  padding: 0 1em;
  margin: 0;
  display: inline-block;
}

.logo {
  height: 90%;
  width: 3em;
  position: relative;
  left: 0;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url('../../assets/images/logo-anim.gif');
}

.accountInfo {
  margin-right: 0;
}

@media only screen and (max-width: 600px) {
  .headerInfo {
    height: auto;
    display: flex;
    flex-basis: 100%;
  }

  .headerInfo div {
    height: auto;
  }
}
</style>
