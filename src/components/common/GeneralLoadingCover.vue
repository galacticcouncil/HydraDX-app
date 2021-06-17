<template>
  <div class="hdx-common-loader-container">
    <div class="loader-cover-content-container">
      <div class="hdx-common-loader" v-show="isLoaderSpinner"></div>
      <div class="loader-messages" v-show="messages && messages.length > 0">
        <div v-for="(msg, index) of messages" :key="index" class="message-item">
          {{ msg }}
        </div>
        <div class="reconnect-api-control" v-if="showReconnectControl">
          <ButtonCommon :on-click="onReconnectApiClick">Reconnect</ButtonCommon>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from '@/store';
import notificationsVars from '@/variables/notifications';

export default defineComponent({
  name: 'GeneralLoadingCover',
  setup() {
    const { getters, dispatch, commit } = useStore();

    const onReconnectApiClick = () => {
      commit('SET_GENERAL_LOADING_SHOW_RECONNECT_CONTROL__NOTIFICATION', false);
      commit('SET_GENERAL_LOADING_SPINNER__NOTIFICATION', true);
      commit('SET_GENERAL_LOADING_MESSAGES__NOTIFICATION', {
        action: 'add',
        message: notificationsVars.loadingMsgApiConnection,
      });
      commit('SET_GENERAL_LOADING_MESSAGES__NOTIFICATION', {
        action: 'delete',
        message: notificationsVars.loadingMsgApiConnectionErrorOccurred,
      });

      dispatch('initializeApiSMGeneral');
    };

    return {
      messages: computed(() => getters.generalLoadingMessagesSMNotification),
      isLoaderSpinner: computed(
        () => getters.generalLoadingSpinnerSMNotification
      ),
      showReconnectControl: computed(
        () => getters.generalLoadingShowReconnectControlSMNotification
      ),
      onReconnectApiClick,
    };
  },
});
</script>

<style scoped></style>
