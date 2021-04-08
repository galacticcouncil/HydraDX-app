<template>
  <div class="hdx-common-number-input">
    <div class="hdx-common-number-input-inner-container">
      <input
        type="tel"
        class="balance-input"
        :value="formattedValue"
        @input="onInput($event)"
        @keypress="onKeyPress($event)"
        :disabled="inputDisabled"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, watch } from 'vue';

import BigNumber from 'bignumber.js';

export default defineComponent({
  name: 'CommonNumberInput',
  props: {
    modelValue: { type: Object, required: true },
    inputDisabled: { type: Boolean, required: false },
  },
  emits: ['update:modelValue'],
  setup(props, context) {
    const formatInput = (value: BigNumber): string => {
      if (!value) return '';
      BigNumber.config({ EXPONENTIAL_AT: [-20, 20] });
      return new BigNumber(value.toString(), 10).toString();
    };

    const unformatInput = (value = '0'): BigNumber => {
      BigNumber.config({ EXPONENTIAL_AT: [-30, 30] });
      return new BigNumber(value, 10);
    };

    const onKeyPress = ($event: KeyboardEvent) => {
      const target = $event.target as HTMLInputElement;
      if (
        (target.value.indexOf('.') !== -1 && $event.key === '.') || //Don't allow 2 .
        (!/\d/.test($event.key) && //Numbers
          $event.key !== '.' && //.
          $event.key !== '8' && //Backspace
          $event.key !== '46') //Delete
      ) {
        $event.preventDefault();
        $event.stopPropagation();
      }
    };

    const onInput = ($event: InputEvent) => {
      const target = $event.target as HTMLInputElement;
      const value = target.value;

      if (
        !value.length ||
        value.endsWith('.') ||
        (value.indexOf('.') !== -1 && value.endsWith('0'))
      )
        return;
      updateValue(unformatInput(value));
    };

    const updateValue = (value: BigNumber) => {
      context.emit('update:modelValue', value);
    };

    return {
      formattedValue: computed(() => {
        return formatInput(props.modelValue as BigNumber);
      }),
      onKeyPress,
      onInput,
    };
  },
});
</script>
