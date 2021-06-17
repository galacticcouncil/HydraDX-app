import { useStore } from '@/store';
import { computed } from 'vue';
import { LS_PD_DAPP_PREVIOUS_CONNECTION_MARKER } from '@/variables/constants';

const { dispatch, getters } = useStore();

export const tryConnectPolkadotDapp = () => {
  try {
    const pdDappPrevConnectionMarker = window.localStorage.getItem(
      LS_PD_DAPP_PREVIOUS_CONNECTION_MARKER
    );
    const extensionInfo = computed(() => getters.extensionInfoSMGeneral);

    if (
      pdDappPrevConnectionMarker &&
      pdDappPrevConnectionMarker === 'true' &&
      !extensionInfo.value.extensionInitialized
    ) {
      setTimeout(() => {
        dispatch('initializePolkadotExtensionSMGeneral');
      }, 300);
    }
  } catch (e) {
    console.log(e);
  }
};
