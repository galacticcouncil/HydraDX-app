<template>
  <div class="balanceInputGroup">
    <input
      type="tel"
      class="balanceInput"
      :value="formattedValue"
      @input="onInput($event)"
      @keypress="onKeyPress($event)"
    />
    <select class="range" v-model="compState.range">
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
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, watch } from 'vue';

import BigNumber from 'bignumber.js';
import * as BN from 'bn.js';
import { decToBn } from '@/services/utils';

export default defineComponent({
  name: 'BalanceInput',
  props: {
    // value: { type: Object, required: true },
    modelValue: { type: Object, required: true },
    options: { type: Object, required: false },
    // onChange: { type: Function, required: true },
  },
  emits: ['update:modelValue'],
  setup(props, context) {
    const compState = reactive({
      range: '1',
    });

    const formatInput = (value: BN, range: string): string => {
      if (!value) return '';

      BigNumber.config({ EXPONENTIAL_AT: [-20, 20] });
      const formattedValue = new BigNumber(value.toString(), 10);
      const decimalFormattedValue = formattedValue
        .dividedBy(1e12)
        .dividedBy(range)
        .toString();
      return decimalFormattedValue;
    };
    const unformatInput = (value = '0', range: string): BN => {
      BigNumber.config({ EXPONENTIAL_AT: [-30, 30] });
      const unformattedValue = new BigNumber(value, 10);
      const decimalUnormattedValue = unformattedValue
        .multipliedBy(1e12)
        .multipliedBy(range);
      const bnUnformatted = decToBn(decimalUnormattedValue);
      return bnUnformatted;
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

      const unformattedValue = unformatInput(value, compState.range);
      updateValue(unformattedValue);
    };

    const updateValue = (value: BN) => {
      // props.onChange(value);
      context.emit('update:modelValue', value);
    };

    //TODO check functionality
    watch(
      () => compState.range,
      newRange => {
        const currentValue = props.modelValue;
        const value = new BigNumber(compState.range).dividedBy(newRange);
        const rangeFixedValue = value.multipliedBy(
          currentValue.toString()
        );
        const bnFixedValue = decToBn(rangeFixedValue);
        updateValue(bnFixedValue);
      }
    );

    return {
      formattedValue: computed(() => {
        return formatInput(props.modelValue as BN, compState.range);
      }),
      compState,
      onKeyPress,
      onInput,
    };
  },
});
</script>

<style scoped>
input,
select {
  background-color: transparent;
  color: #5eafe1;
  border-width: 1px;
  font-size: 1em;
  border-color: #5eafe1;
  outline: none;
  vertical-align: bottom;
}
.range {
  width: 35%;
}
.balanceInput {
  width: 65%;
  text-align: right;
}
</style>
