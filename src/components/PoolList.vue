<template>
  <div class="poolList"></div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

export default Vue.extend({
  name: "PoolList",
  computed: mapGetters(["blockInfo"])
});
</script>

<style scoped></style>
