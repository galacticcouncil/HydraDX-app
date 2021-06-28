<template>
  <!--  <div class="hdx-balance-input-group">-->
  <input
    type="tel"
    class="balance-input"
    :value="formattedValue"
    @input="onInput($event)"
    @keypress="onKeyPress($event)"
    :disabled="inputDisabled"
  />
  <select class="range" v-model="compState.range" :disabled="inputDisabled">
    <option value="1e-15">femto</option>
    <option value="1e-12">pico</option>
    <option value="1e-9">nano</option>
    <option value="1e-6">micro</option>
    <option value="1e-3">mili</option>
    <option value="1" selected>{{ options ? options.units : '' }}</option>
    <option value="1e3">kilo</option>
    <option value="1e6">mega</option>
    <option value="1e9">giga</option>
    <option value="1e12">tera</option>
    <option value="1e15">peta</option>
  </select>
  <!--  </div>-->
</template>

<script lang="ts">
import { defineComponent, computed, reactive, watch, onMounted } from 'vue';

import BigNumber from 'bignumber.js';

export default defineComponent({
  name: 'BalanceInput',
  props: {
    // value: { type: Object, required: true },
    modelValue: { type: Object, required: true },
    options: { type: Object, required: false },
    inputDisabled: { type: Boolean, required: false },
    // onChange: { type: Function, required: true },
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
      range: '1',
      isUserValueValid: true,
    });

    const formattedValue = computed(() => {
      let currentVal = new BigNumber(0);

      if (!compState.isUserValueValid) return compState.currentInputValueString;

      if (!props.modelValue.isNaN() && props.modelValue.isFinite()) {
        currentVal = props.modelValue as BigNumber;
      }

      return formatInput(currentVal, compState.range);
    });

    const formatInput = (value: BigNumber, range: string): string => {
      if (!value) return '';

      BigNumber.config({ EXPONENTIAL_AT: [-20, 20] });
      const formattedValue = new BigNumber(value.toString(), 10);
      // return formattedValue.dividedBy(1e12).dividedBy(range).toString();
      return formattedValue.dividedBy(range).toString();
    };
    const unformatInput = (value = '0', range: string): BigNumber => {
      BigNumber.config({ EXPONENTIAL_AT: [-30, 30] });
      const unformattedValue = new BigNumber(value, 10);
      return unformattedValue.multipliedBy(range);
      // return unformattedValue.multipliedBy(1e12).multipliedBy(range);
      // const bnUnformatted = decToBn(decimalUnormattedValue);
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
        unformattedValue = unformatInput(value, compState.range);
      }

      // const unformattedValue = unformatInput(value, compState.range);
      updateValue(unformattedValue);
    };

    const updateValue = (value: BigNumber) => {
      context.emit('update:modelValue', value);
    };

    /**
     * ==== Hooks ===
     */

    onMounted(() => {
      if (props.options && props.options.range !== undefined) {
        compState.range = props.options.range;
      }
    });

    //TODO check functionality
    watch(
      () => compState.range,
      newRange => {
        const currentValue = props.modelValue;
        const value = new BigNumber(compState.range).dividedBy(newRange);
        const rangeFixedValue = value.multipliedBy(currentValue.toString());
        // const bnFixedValue = decToBn(rangeFixedValue); 1999000.000000000001
        updateValue(rangeFixedValue);
      }
    );

    return {
      formattedValue,
      compState,
      onKeyPress,
      onInput,
    };
  },
});
</script>
