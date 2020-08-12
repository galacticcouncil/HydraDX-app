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
          v-model="currentScreen"
          type="radio"
          name="screen"
          value="trade"
        />TRADE</label
      >
      <label :class="{ selected: currentScreen === 'liquidity' }">
        <input
          v-model="currentScreen"
          type="radio"
          name="screen"
          value="liquidity"
        />LIQUIDITY</label
      >
      <label :class="{ selected: currentScreen === 'wallet' }">
        <input
          v-model="currentScreen"
          type="radio"
          name="screen"
          value="wallet"
        />WALLET</label
      >
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

export default Vue.extend({
  name: "Header",
  computed: {
    currentScreen: {
      get() {
        return this.$store.state.currentScreen;
      },
      set(screen) {
        this.$store.commit("setScreen", screen);
      }
    },
    ...mapGetters(["blockInfo", "accountInfo"])
  }
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
  background-image: url("../assets/logo-anim.gif");
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
