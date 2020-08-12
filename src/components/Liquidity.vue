<template>
  <div class="liquidity"></div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

export default Vue.extend({
  name: "Head",
  computed: mapGetters(["blockInfo"])
});
</script>

<style scoped></style>
