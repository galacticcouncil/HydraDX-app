<template>
  <div class="hdx-common-loader-container">
    <div class="hdx-common-loader"></div>
    <div class="loader-messages" v-show="messages && messages.length > 0">
      <div v-for="(msg, index) of messages" :key="index" class="message-item">
        {{ msg }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from '@/store';

export default defineComponent({
  name: 'GeneralLoadingCover',
  setup() {
    const { getters } = useStore();

    return {
      messages: computed(() => getters.generalLoadingMessagesSMNotification),
    };
  },
});
</script>

<style scoped></style>
