<template>
  <div class="trade"></div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

export default Vue.extend({
  name: "Trade",
  computed: mapGetters(["blockInfo"])
});
</script>

<style scoped></style>
