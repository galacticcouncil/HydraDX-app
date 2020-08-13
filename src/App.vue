<template>
  <div id="app">
    <Init v-if="currentScreen === 'initial'" />
    <Header v-if="currentScreen !== 'initial'" />
    <Wallet v-if="currentScreen === 'wallet'" />
    <Liquidity v-if="currentScreen === 'liquidity'" />
    <Trade v-if="currentScreen === 'trade'" />
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";

import Init from "./components/Init.vue";
import Header from "./components/Header.vue";
import Wallet from "./components/Wallet.vue";
import Liquidity from "./components/Liquidity.vue";
import Trade from "./components/Trade.vue";

export default {
  name: "App",
  components: {
    Header,
    Wallet,
    Init,
    Liquidity,
    Trade
  },
  computed: mapGetters(["currentScreen"])
};
</script>

<style>
@font-face {
  font-family: "Pexico-Regular";
  src: url("./assets/Pexico-Regular/font.woff2") format("woff2");
}
* {
  box-sizing: border-box;
  border-color: #f653a2;
  border-style: solid;
  border-width: 0px;
}

html,
body {
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: #0d106e;
}

div {
  display: block;
}

a,
:visited {
  color: #5eafe1;
}

.inverted {
  background-color: #5eafe1;
  color: #0d106e;
}

.menu {
  display: flex;
  height: auto;
}

.menu label {
  box-sizing: border-box;
  font-size: 1.2em;
  font-weight: 600;
  flex-basis: 100%;
  padding: 1em;
  border-right-width: 1px;
  border-top-width: 1px;
}

.menu input {
  display: none;
}

.menu label:hover {
  box-shadow: 0 0 15px #f653a2 inset;
}

.selected {
  background-color: #0c36a1;
}

button,
input {
  font-family: Pexico-Regular, sans-serif;
}

#app {
  font-family: Pexico-Regular, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #5eafe1;
}
</style>
