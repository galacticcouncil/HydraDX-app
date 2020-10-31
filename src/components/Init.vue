<template>
  <div class="init">
    <h1>WELCOME TO HACK.HYDRA_DX</h1>
    <div class="logo"></div>
    <div class="blockInfo" v-if="!extensionInfo.extensionPresent">
      block number: {{ blockInfo.blockNumber }}
    </div>
    <div class="information" v-if="!extensionInfo.extensionPresent">
      Please use Chrome or Firefox with respective polkadot{.js}
      <a href="https://github.com/polkadot-js/extension#installation"
        >extension</a
      >
      installed and authorize HACK.HydraDX.io to access your address list.
    </div>
    <!-- <div>Or explore the <button v-on="click">app</button></div> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

export default Vue.extend({
  name: "Init",
  computed: mapGetters(["blockInfo", "extensionInfo"]),
});
</script>

<style scoped>
.logo {
  width: 100%;
  height: 30vh;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url("../assets/logo-anim.gif");
}
</style>
