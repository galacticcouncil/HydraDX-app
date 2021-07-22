import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import AppLayout from '@/layouts/AppLayout.vue';
import Toast, { PluginOptions } from 'vue-toastification';

import NoticeMessage from '@/components/common/NoticeMessage.vue';
import LinkWithStatus from '@/components/common/LinkWithStatus.vue';
import ButtonWithStatus from '@/components/common/ButtonWithStatus.vue';
import ButtonCommon from '@/components/common/ButtonCommon.vue';
import CommonPanel from '@/components/common/CommonPanel.vue';
import BalanceInput from '@/components/common/BalanceInput.vue';
import PagePanelLayout from '@/components/common/PagePanelLayout.vue';
import ModalCommon from '@/components/common/ModalCommon.vue';
import VueClickAway from 'vue3-click-away';

const options: PluginOptions = {
  timeout: 6000,
  toastClassName: 'hdx-toast-container',
};

import '@/assets/styles/scss/main.scss';
import 'vue-toastification/dist/index.css';

createApp(App)
  .use(store)
  .use(router)
  .use(Toast, options)
  .use(VueClickAway)
  .component('AppLayout', AppLayout)
  .component('CommonPanel', CommonPanel)
  .component('NoticeMessage', NoticeMessage)
  .component('LinkWithStatus', LinkWithStatus)
  .component('ButtonWithStatus', ButtonWithStatus)
  .component('ButtonCommon', ButtonCommon)
  .component('BalanceInput', BalanceInput)
  .component('PagePanelLayout', PagePanelLayout)
  .component('ModalCommon', ModalCommon)
  .mount('#app');
