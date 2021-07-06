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
import { defineComponent, computed, reactive } from 'vue';

import BigNumber from 'bignumber.js';

export default defineComponent({
  name: 'CommonNumberInput',
  props: {
    modelValue: { type: Object, required: true },
    inputDisabled: { type: Boolean, required: false },
  },
  emits: ['update:modelValue'],
  setup(props, context) {
    const compState = reactive({
      /**
       * "currentInputValueString" is necessary for cases, when user enters
       * some not valid value (e.g. "2.", "0.00"). Input component must provide
       * BigNumber value, but when user starts enter value and during entering
       * value is not valid, components cannot convert it to BigNumber. That's
       * why we need use input value from inner component state till user enter
       * valid value. If value is valid, component uses value from outer state.
       */
      currentInputValueString: '0',
      isUserValueValid: true,
    });

    const formattedValue = computed(() => {
      let currentVal = new BigNumber(0);

      if (!compState.isUserValueValid) return compState.currentInputValueString;

      if (!props.modelValue.isNaN() && props.modelValue.isFinite()) {
        currentVal = props.modelValue as BigNumber;
      }

      return formatInput(currentVal as BigNumber);
    });

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

      compState.currentInputValueString = value;

      if (
        // !value.length ||
        value.endsWith('.') ||
        (value.indexOf('.') !== -1 && value.endsWith('0'))
      ) {
        compState.isUserValueValid = false;
        updateValue(new BigNumber(0));
        return;
      }

      compState.isUserValueValid = true;

      let unformattedValue = new BigNumber(0);

      if (value.length) {
        unformattedValue = unformatInput(value);
      }

      updateValue(unformattedValue);
    };

    const updateValue = (value: BigNumber) => {
      context.emit('update:modelValue', value);
    };

    return {
      formattedValue,
      onKeyPress,
      onInput,
    };
  },
});
</script>
