<template>
  <div class="wallet">
    <!-- CURRENT ACCOUNT INFO -->
    <div class="currentAccount inverted">
      <h3 v-if="accountInfo">SELECTED ACCOUNT</h3>
      <h3 v-if="!accountInfo">PLEASE SELECT ACCOUNT</h3>
      <div v-if="accountList.length < 1">
        PLEASE ADD ACCOUNT WITH polkadot{.js}
        <a href="https://github.com/polkadot-js/extension#installation"
          >EXTENSION</a
        >
      </div>
      <div class="accountRecord" v-if="accountInfo">
        <div class="accountName">{{ accountInfo.name }}:</div>
        <div class="accountHash">
          {{ accountInfo.address }}
        </div>
      </div>
    </div>

    <!-- MENU -->
    <div class="menu">
      <label :class="{ selected: screenState === 'select' }">
        <input
          v-model="screenState"
          type="radio"
          name="screenState"
          value="select"
        />{{ accountInfo ? "CHANGE ACCOUNT" : "SELECT ACCOUNT" }}</label
      >
      <label :class="{ selected: screenState === 'tokens' }">
        <input
          v-model="screenState"
          type="radio"
          name="screenState"
          value="tokens"
        />TOKENS</label
      >
    </div>

    <!-- ACCOUNT LIST -->
    <div class="accountScreen" v-if="screenState === 'select'">
      <div class="noAccounts" v-if="accountInfo && accountList.length === 1">
        NO ACCOUNTS TO CHANGE...
      </div>
      <div
        class="accountList"
        v-if="
          (accountInfo && accountList.length > 1) ||
            (!accountInfo && accountList.length === 1)
        "
      >
        <div
          v-for="accountRecord in accountList"
          v-bind:key="accountRecord.address"
        >
          <div class="accountRecord" v-if="account !== accountRecord.address">
            <label>
              <input
                v-model="account"
                type="radio"
                name="account"
                :value="accountRecord.address"
              />
              <div class="accountName">{{ accountRecord.name }}:</div>
              <div class="accountHash">{{ accountRecord.address }}</div>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- TOKEN SCREEN -->
    <div class="tokenScreen" v-if="screenState === 'tokens'">
      <div class="noTokens" v-if="!assetBalances">
        HUH?... UNHELPFUL ERROR
      </div>
      <div class="tokenList" v-if="assetBalances && assetBalances.length">
        <div class="legend inverted">
          <div class="name">TOKEN</div>
          <div class="balance">BALANCE</div>
          <div class="faceut">GET BALANCE</div>
        </div>
        <div
          class="assetRecord"
          v-for="assetRecord in [...assetBalances].sort((a, b) => Number(b.balance) - Number(a.balance))"
          v-bind:key="assetRecord.assetId"
        >
          <div class="name">{{ assetRecord.name }}</div>
          <div class="balance">{{ assetRecord.balanceFormatted }}</div>
          <div class="faceut" v-if="!assetRecord.shareToken">
            <button @click="mintAsset(assetRecord.assetId)">
              ++GET++
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

// TODO: nicer
const account = localStorage.getItem("account");

export default Vue.extend({
  name: "Wallet",
  data: () => {
    return {
      screenState: account ? "tokens" : "select"
    };
  },
  methods: {
    mintAsset: function(value: number) {
      this.$store.dispatch("mintAsset", value);
    }
  },
  computed: {
    account: {
      get() {
        return this.$store.state.account;
      },
      set(value) {
        this.$store.commit("setAccount", value);
      }
    },
    ...mapGetters(["accountList", "accountInfo", "assetBalances"])
  }
});
</script>

<style scoped>
a,
:visited {
  color: #0d106e;
}

.currentAccount {
  padding: 0.6em;
}

.currentAccount div {
  padding: 0.2em;
  display: inline-block;
}

.accountListWrapper {
  padding: 1em;
}

.accountList .accountRecord {
  border-bottom-width: 1px;
  border-bottom-color: #5eafe1;
}

.accountRecord div {
  display: inline-block;
}

.accountList input {
  margin-right: 1em;
  display: inline;
}

.accountList label {
  width: 100%;
  display: block;
  padding: 1.5em;
}

.menu label:hover {
  box-shadow: 0 0 10px #5eafe1 inset;
}

.noAccounts {
  padding: 1.5em;
}

.menu label {
  border-color: #5eafe1;
  border-bottom-width: 1px;
}

.tokenList button:hover,
label:hover {
  border-top-width: 1px;
  border-color: #5eafe1;
  box-shadow: 0 0 7px #5eafe1 inset;
}

.tokenList .assetRecord,
.legend {
  display: flex;
  border-bottom-width: 1px;
  border-color: #5eafe1;
}

.tokenList .assetRecord div,
.legend div {
  height: 3em;
}

.name {
  flex-basis: 30%;
  text-align: left;
  padding: 1em;
}

.balance {
  flex-basis: 40%;
  padding: 1em;
}

.faceut {
  flex-basis: 30%;
  text-align: right;
  border-left-width: 1px;
  border-color: #5eafe1;
  border-right-width: 1px;
}

.legend .faceut {
  padding: 1em;
}

.tokenList button {
  outline: none;
  width: 100%;
  height: 3em;
  padding: 1em;
  font-size: 1em;
  background: transparent;
  text-decoration: underline;
  color: #5eafe1;
}

/* .menu .selected {
  background-color: #5eafe1;
  color: #0d106e;
} */
</style>
