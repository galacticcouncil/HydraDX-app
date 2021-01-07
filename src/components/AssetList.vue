<template>
  <div class="assetList">
    <div class="assetRecord" v-for="(asset, key) in assetList" :key="key">
      <div class="listItem">
        <label :class="{ selected: modelValue == asset.assetId }">
          <input
            @input="onUpdateValue"
            type="radio"
            :name="name"
            :checked="modelValue == asset.assetId"
            :value="asset.assetId"
          />
          {{ assetList[key].name }}
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AssetList',
  props: {
    name: { type: String, required: true },
    modelValue: { type: String, required: false },
    assetList: { type: Array, required: true },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const onUpdateValue = ($event: Event) => {
      const target = $event.target as HTMLInputElement;
      emit('update:modelValue', target.value);
    };
    return {
      onUpdateValue,
    };
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
