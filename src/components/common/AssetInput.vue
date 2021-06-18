<template>
  <div class="hdx-asset-input">
    <div class="hdx-asset-input-inner-container">
      <select
        class="asset-selector"
        v-model="currentAsset"
        :placeholder="placeholder"
        :disabled="singleAsset"
      >
        <template v-if="!singleAsset">
          <option data-placeholder-option :value="null" disabled>
            {{ placeholder }}
          </option>
          <option
            v-for="(asset, index) in assetsList"
            :key="index"
            :value="asset.assetId.toString()"
          >
            {{ asset.name }}
          </option>
        </template>
        <template v-else>
          <option :value="currentAsset" selected>{{ currentAsset }}</option>
        </template>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'AssetInput',
  props: {
    assetsList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    asset: {
      type: String,
      default: '',
    },
    onAssetSelect: {
      type: Function,
      default: () => {
        return;
      },
    },
    singleAsset: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const currentAsset = computed({
      get: () => props.asset,
      set: (selectedAsset: string) => {
        props.onAssetSelect(selectedAsset);
      },
    });

    return {
      currentAsset,
    };
  },
});
</script>
