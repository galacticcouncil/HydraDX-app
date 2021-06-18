<template>
  <div class="header-accounts-control-panel">
    <!--    <div class="selected-account-short-info" v-if="accountInfo">-->
    <!--      Account: {{ accountInfo.name }}-->
    <!--    </div>-->
    <div class="accounts-list-toggle" v-if="extensionInfo.extensionInitialized">
      <ButtonCommon
        small
        :on-click="() => onToggleAccountsListPopup(!openAccountListPopup)"
        custom-class="mt-0 mb-0 connect-account-btn"
        >{{
          !accountInfo ? 'Select wallet' : `Account: ${accountInfo.name}`
        }}</ButtonCommon
      >
    </div>
    <div v-if="openAccountListPopup" class="accounts-list-popup-container">
      <div class="accounts-list-popup-header">
        <ButtonCommon
          small
          :on-click="() => onToggleAccountsListPopup(false)"
          custom-class="mt-0 mb-0"
          >Close</ButtonCommon
        >
      </div>
      <div
        class="accounts-list-popup-inner-container"
        v-if="accountList.length > 0"
      >
        <div
          v-for="accountRecord in accountList"
          :key="accountRecord.address"
          class="account-list-item"
          :class="{ 'active-acc': accountRecord.address === currentAccount }"
          @click.prevent="() => onChangeAccountClick(accountRecord.address)"
        >
          <div class="account-name">{{ accountRecord.name }}</div>
          <div class="account-hash">{{ accountRecord.address }}</div>
        </div>
      </div>
    </div>
    <ButtonCommon
      small
      v-if="!accountInfo && !extensionInfo.extensionInitialized"
      :on-click="onConnectAccountClick"
      custom-class="mt-0 mb-0 connect-account-btn"
      >Connect account</ButtonCommon
    >
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useStore } from '@/store';

export default defineComponent({
  name: 'HeaderAccountsControlPanel',
  setup() {
    const { getters, dispatch } = useStore();
    const openAccountListPopup = ref(false);

    const onConnectAccountClick = () => {
      dispatch('initializePolkadotExtensionSMGeneral');
    };

    const onToggleAccountsListPopup = (newVal: boolean): void => {
      openAccountListPopup.value = newVal;
    };

    const onChangeAccountClick = async (accountAddress: string) => {
      dispatch('changeAccountSMWallet', accountAddress);
    };

    return {
      accountInfo: computed(() => getters.accountInfoSMWallet),
      extensionInfo: computed(() => getters.extensionInfoSMGeneral),
      accountList: computed(() => getters.accountListSMWallet),
      currentAccount: computed(() => getters.accountSMWallet),
      openAccountListPopup,
      onConnectAccountClick,
      onToggleAccountsListPopup,
      onChangeAccountClick,
    };
  },
});
</script>
