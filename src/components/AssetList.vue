<template>
  <div class="assetList">
    <div class="assetRecord" v-for="(asset, key) in assetList" v-bind:key="key">
      <div class="listItem">
        <label :class="{ selected: value == asset.assetId }">
          <input
            @input="updateValue"
            type="radio"
            :name="name"
            :checked="value == asset.assetId"
            :value="asset.assetId"
          />
          {{ assetList[key].name }}
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "../vue-typed/vue-typed";

export default Vue.extend({
  name: "AssetList",
  props: {
    name: { type: String, required: true },
    value: { type: String, required: false },
    assetList: { type: Array, required: true },
  },
  methods: {
    updateValue($event: Event) {
      const target = $event.target as HTMLInputElement;
      this.$emit("input", target.value);
    },
  },
});
</script>

<style scoped>
.assetRecord .listItem {
  width: 100%;
}

label {
  padding: 1em;
  display: block;
  width: 100%;
}

.assetRecord label:hover {
  border-top-width: 1px;
  border-color: #5eafe1;
  box-shadow: 0 0 7px #5eafe1 inset;
}

.assetRecord input {
  margin: 0;
}
</style>
