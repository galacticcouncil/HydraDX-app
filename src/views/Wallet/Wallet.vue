<template>
  <div class="page-wrapper wallet">
    <AssetsDetailsList />

    <NoticeMessage error v-if="!extensionInfo.extensionPresent">
      <p>
        Please use Chrome or Firefox with respective polkadot{.js}
        <a href="https://github.com/polkadot-js/extension#installation"
          >extension</a
        >
        installed and authorize HACK.HydraDX.io to access your address list.
      </p>
      <p>
        If you rejected access HyrdraDX application to Polkadot.js extension
        before, but you want allow access now, you can do next steps:
      </p>
      <ul>
        <li>Open Polkadot.js extension</li>
        <li>Find in Settings "Manage Website Access" option</li>
        <li>Find in existing list necessary resource and allow access</li>
        <li>
          Close/Open HydraDX app page or just make hard reload of the page
        </li>
        <li>Enjoy! (~˘▾˘)~</li>
      </ul>
    </NoticeMessage>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useStore } from '@/store';
import notifications from '@/variables/notifications';
import { useToast } from 'vue-toastification';
import AssetsDetailsList from '@/components/wallet/AssetsDetailsList.vue';
export default defineComponent({
  name: 'Wallet',
  components: { AssetsDetailsList },
  setup() {
    const { getters, dispatch } = useStore();
    const screenState = ref('tokens');
    const toast = useToast();

    onMounted(() => {
      screenState.value = localStorage.getItem('account') ? 'tokens' : 'select';
      setTimeout(() => {
        dispatch('initializePolkadotExtensionSMGeneral');
      }, 300);
    });

    const mintAsset = (assetId: number) => {
      if (getters.accountSMWallet && getters.extensionInfoSMGeneral) {
        dispatch('mintAssetSMWallet', assetId);
      } else {
        toast.error(notifications.connectAccountIsRequired);
        screenState.value = 'select';
      }
    };

    const onChangeAccountClick = async (accountAddress: string) => {
      dispatch('changeAccountSMWallet', accountAddress);
    };

    const onWalletScreenChange = (selectedScreen: string) => {
      screenState.value = selectedScreen;
    };

    const assetBalances = computed(() => getters.assetBalancesSMWallet);

    return {
      accountList: computed(() => getters.accountListSMWallet),
      accountInfo: computed(() => getters.accountInfoSMWallet),
      assetBalances,
      currentAccount: computed(() => getters.accountSMWallet),
      extensionInfo: computed(() => getters.extensionInfoSMGeneral),
      screenState,
      mintAsset,
      onChangeAccountClick,
      onWalletScreenChange,
    };
  },
});
</script>

<style scoped>
a,
:visited {
  color: #0d106e;
}

.tokenList {
  background-color: #0c36a1;
}

.currentAccount {
  padding: 0.6em;
}

.currentAccount div {
  padding: 0.2em;
  display: inline-block;
}

.accountListWrapper {
  padding: 1em;
}

.accountList .accountRecord {
  border-bottom-width: 1px;
  border-bottom-color: #5eafe1;
}

.accountRecord div {
  display: inline-block;
}

.accountList input {
  margin-right: 1em;
  display: inline;
}

.accountList label {
  width: 100%;
  display: block;
  padding: 1.5em;
}

.menu label:hover {
  box-shadow: 0 0 10px #5eafe1 inset;
}

.noAccounts {
  padding: 1.5em;
}

.menu label {
  border-color: #5eafe1;
  border-bottom-width: 1px;
}

.tokenList button:hover,
label:hover {
  border-top-width: 1px;
  border-color: #5eafe1;
  box-shadow: 0 0 7px #5eafe1 inset;
}

.tokenList .assetRecord,
.legend {
  display: flex;
  border-bottom-width: 1px;
  border-color: #5eafe1;
}

.tokenList .assetRecord div,
.legend div {
  height: 3em;
}

.name {
  flex-basis: 30%;
  text-align: left;
  padding: 1em;
}

.balance {
  flex-basis: 40%;
  padding: 1em;
}

.faceut {
  flex-basis: 30%;
  text-align: right;
  border-left-width: 1px;
  border-color: #5eafe1;
  border-right-width: 1px;
}

.legend .faceut {
  padding: 1em;
}

.tokenList button {
  width: 100%;
  height: 3em;
  padding: 1em;
  font-size: 1em;
  color: #5eafe1;
}

/* .menu .selected {
  background-color: #5eafe1;
  color: #0d106e;
} */
</style>
