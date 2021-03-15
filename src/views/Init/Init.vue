<template>
  <div class="page-wrapper init">
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
import { defineComponent, computed, watch } from 'vue';
import { useStore } from '@/store';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Init',
  setup() {
    const { getters } = useStore();
    const router = useRouter();

    /**
     * If Polkadot extension has been connected in previous sessions, we need
     * redirect user to Wallet page.
     */
    if (getters.apiConnectionValidSMGeneral && getters.accountSMWallet)
      router.push('/trade');
    watch(
      () => getters.apiConnectionValidSMGeneral,
      (isValidNew, isValidOld) => {
        if (isValidNew && isValidNew !== isValidOld) router.push('/trade');
      }
    );

    return {
      blockInfo: computed(() => getters.blockInfoSMGeneral),
      extensionInfo: computed(() => getters.extensionInfoSMGeneral),
    };
  },
});
</script>

<style scoped>
.logo {
  width: 100%;
  height: 30vh;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url('../../assets/images/logo-anim.gif');
}
</style>
