<template>
  <div class="balanceInputGroup">
    <input
      type="tel"
      class="balanceInput"
      :value="formattedValue"
      @input="onInput($event)"
      @keypress="onKeyPress($event)"
    />
    <select class="range" v-model="range">
      <option value="1e-15">femto</option>
      <option value="1e-12">pico</option>
      <option value="1e-9">nano</option>
      <option value="1e-6">micro</option>
      <option value="1e-3">mili</option>
      <option value="1" selected>{{ options ? options.units : "" }}</option>
      <option value="1e3">kilo</option>
      <option value="1e6">mega</option>
      <option value="1e9">giga</option>
      <option value="1e12">tera</option>
      <option value="1e15">peta</option>
    </select>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import BigNumber from "bignumber.js";
import * as BN from "bn.js";
import { decToBn } from "../store/util";

const formatInput = (value: BN, range: string): string => {
  BigNumber.config({ EXPONENTIAL_AT: [-20, 20] });
  const formattedValue = new BigNumber(value.toString(), 10);
  const decimalFormattedValue = formattedValue
    .dividedBy(1e12)
    .dividedBy(range)
    .toString();
  return decimalFormattedValue;
};
const unformatInput = (value: string, range: string): BN => {
  BigNumber.config({ EXPONENTIAL_AT: [-20, 20] });
  const unformattedValue = new BigNumber(value, 10);
  const decimalUnormattedValue = unformattedValue
    .multipliedBy(1e12)
    .multipliedBy(range);
  const bnUnformatted = decToBn(decimalUnormattedValue);
  return bnUnformatted;
};

export default Vue.extend({
  name: "BalanceInput",
  props: {
    value: { type: Object, required: true },
    options: { type: Object, required: false },
  },
  data: () => {
    return { range: "1" };
  },
  computed: {
    formattedValue() {
      return formatInput(this.value, this.range);
    },
  },
  watch: {
    range: function (oldVal, newVal) {
      const value = new BigNumber(this.range).dividedBy(newVal);
      const rangeFixedValue = value.multipliedBy(this.value.toString());
      const bnFixedValue = decToBn(rangeFixedValue);
      this.updateValue(bnFixedValue);
    },
  },
  methods: {
    onKeyPress($event: KeyboardEvent) {
      const target = $event.target as HTMLInputElement;
      if (
        (target.value.indexOf(".") !== -1 && $event.key === ".") || //Don't allow 2 .
        (!/\d/.test($event.key) && //Numbers
          $event.key !== "." && //.
          $event.key !== "8" && //Backspace
          $event.key !== "46") //Delete
      ) {
        $event.preventDefault();
        $event.stopPropagation();
      }
    },
    onInput($event: InputEvent) {
      const target = $event.target as HTMLInputElement;
      const value = target.value;

      if (
        !value.length ||
        value.endsWith(".") ||
        (value.indexOf(".") !== -1 && value.endsWith("0"))
      )
        return;

      const unformattedValue = unformatInput(value, this.range);
      this.updateValue(unformattedValue);
    },
    updateValue(value: BN) {
      this.$emit("input", value);
    },
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
