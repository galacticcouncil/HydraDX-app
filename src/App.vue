<template>
  <div id="app">
    <AppLayout>
      <router-view />
    </AppLayout>
  </div>
</template>

<style lang="scss">
@font-face {
  font-family: 'Pexico-Regular';
  src: url('./assets/font/Pexico-Regular/font.woff2') format('woff2');
}
* {
  box-sizing: border-box;
  border-color: #f653a2;
  border-style: solid;
  border-width: 0px;
}

html,
body {
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: #0d106e;
}

div {
  display: block;
}

a,
:visited {
  color: #5eafe1;
}

.inverted {
  background-color: #5eafe1;
  color: #0d106e;
}

.menu {
  display: flex;
  height: auto;
}

.menu label {
  box-sizing: border-box;
  font-size: 1.2em;
  font-weight: 600;
  flex-basis: 100%;
  padding: 1em;
  border-right-width: 1px;
  border-top-width: 1px;
}

.menu input {
  display: none;
}

.menu label:hover {
  box-shadow: 0 0 15px #f653a2 inset;
}

.selected {
  background-color: #0c36a1;
}

button {
  outline: none;
  background: transparent;
  text-decoration: underline;
}

button,
input {
  font-family: Pexico-Regular, sans-serif;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

#app button:disabled,
#app input:disabled {
  color: #aaa;
  border-color: #aaa;
}

.disabled {
  color: #aaa;
  border-color: #aaa;
}

.noPools,
.noTokens {
  padding: 3em;
  font-size: 1.5em;
  border-width: 3px;
}

#app {
  font-family: Pexico-Regular, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #5eafe1;
}

.pendingAction .headerInfo,
.pendingAction button,
.pendingAction .legend {
  animation: filter-animation 1s infinite;
}

@keyframes filter-animation {
  0% {
    filter: hue-rotate(80deg);
  }

  50% {
    filter: hue-rotate(210deg);
  }

  100% {
    filter: hue-rotate(80deg);
  }
}
</style>
