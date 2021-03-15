import { ActionTree } from 'vuex';
import { Api, ApiPromise } from 'hydradx-js';
import { formatBalance } from '@polkadot/util';
import { useToast } from 'vue-toastification';
import notifications from '@/variables/notifications';
import notificationsVars from '@/variables/notifications';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import {
  web3Enable,
  web3AccountsSubscribe,
} from '@polkadot/extension-dapp';

const syncWallets = async (
  updateFunction: (accounts: InjectedAccountWithMeta[]) => void
): Promise<null> => {
  // returns an array of all the injected sources
  // (this needs to be called first, before other requests)
  const allInjected = await web3Enable('HACK.HydraDX.io');

  if (!allInjected.length) {
    return null;
  } else {
    web3AccountsSubscribe(updateFunction);
    return null;
  }
};

export const actions: ActionTree<GeneralState, MergedState> & GeneralActions = {
  updateBlockHashSMGeneral({ commit }, payload: string | null) {
    commit('SET_BLOCK_HASH__GENERAL', payload);
  },
  updateBlockNumberSMGeneral({ commit }, payload: number) {
    commit('SET_BLOCK_NUMBER__GENERAL', payload);
  },
  async initializePolkadotExtensionSMGeneral({ commit, dispatch }) {
    try {
      // INITIALIZE WALLET
      commit('SET_EXTENSION_PRESENT__GENERAL', false);

      const accountSubscription = await syncWallets(
        (payload: InjectedAccountWithMeta[]) => {
          dispatch('updateWalletInfoSMWallet', payload);
        }
      );

      // () => {
      //   //TODO Add error notice
      //   console.log('error PD extension connect');
      // }

      if (accountSubscription) {
        commit('SET_EXTENSION_PRESENT__GENERAL', true);
      }

      commit('SET_GENERAL_LOADING__GENERAL', false);
      commit('SET_EXTENSION_INITIALIZED__GENERAL', true);
    } catch (e) {
      console.log(e);

      //TODO Add error notice
    }
  },
  async initializeApiSMGeneral(context) {
    const { commit, dispatch } = context;
    const toast = useToast();

    try {
      const apiInstance = await Api.initialize({
        error: (e: Error) => {
          console.log('on error listener - ', e);
          commit('SET_GENERAL_LOADING__GENERAL', true);
          commit('SET_GENERAL_LOADING_MESSAGES__GENERAL', {
            action: 'delete',
            message: notificationsVars.loadingMsgApiConnection,
          });
          commit('SET_GENERAL_LOADING_MESSAGES__GENERAL', {
            action: 'add',
            message: notificationsVars.loadingMsgApiConnectionErrorOccurred,
          });
        },
        disconnected: () => {
          console.log('on disconnected listener');
          commit('SET_GENERAL_LOADING__GENERAL', true);
          commit('SET_GENERAL_LOADING_MESSAGES__GENERAL', {
            action: 'add',
            message: notificationsVars.loadingMsgApiConnection,
          });
        },
        connected: () => {
          console.log('on connected listener');
          commit('SET_GENERAL_LOADING__GENERAL', false);
        },
        //TODO add parameter to the hydra-js
        ready: (apiInstance?: ApiPromise) => {
          console.log('on ready listener - ', apiInstance);
          commit('SET_GENERAL_LOADING__GENERAL', false);
        },
      });

      console.log('apiInstance - ', apiInstance);

      if (!apiInstance) return 1;

      // INITIALIZE HELPERS
      formatBalance.setDefaults({
        decimals: 12,
        unit: '',
      });

      const int = apiInstance.createType('FixedU128', '100000000000000');
      console.log(int.toHuman());
      //
      // // INITIALIZE WALLET
      // commit('SET_EXTENSION_PRESENT__GENERAL', false);
      //
      // try {
      //   const accountSubscription = await syncWallets(payload => {
      //     dispatch('updateWalletInfoSMWallet', payload);
      //   });
      //
      //   if (accountSubscription) {
      //     commit('SET_EXTENSION_PRESENT__GENERAL', true);
      //   }
      //   commit('SET_EXTENSION_INITIALIZED__GENERAL', true);
      // } catch (e) {
      //   console.log(e);
      // }
      //
      apiInstance.query.system.events((events: any) => {
        // const eventsMap = events.map(record => {
        //   // Extract the phase, event and the event types
        //   const { event, phase } = record;
        //   const types = event.typeDef;
        //   //if (event.section === "exchange") {
        //   // Show what we are busy with
        //   console.log(
        //     `\t${event.section}:${event.method}:: (phase=${phase.toString()})`
        //   );
        //   console.log(`\t\t${event.meta.documentation.toString()}`);
        //   // Loop through each of the parameters, displaying the type and data
        //   // event.data.forEach((data, index) => {
        //   //   console.log(`\t\t\t${types[index].type}: ${data.toString()}`);
        //   // });
        //   //}
        //   return event;
        // });
        console.log('eventsMap', events);
        dispatch('updateTransactionsSMTrade', {
          events: events,
          instanceOwner: 'Global events listener',
        });
      });

      await apiInstance.rpc.chain.subscribeNewHeads((header: any) => {
        dispatch('syncAssetBalancesSMWallet');
        dispatch('syncAssetListSMWallet');
        dispatch('syncPoolsSMPool');
        commit('SET_PENDING_ACTION__GENERAL', false);
        commit('SET_BLOCK_INFO__GENERAL', {
          blockNumber: header.number.toNumber(),
          blockHash: header.hash.toString(),
        });
      });
      // TODO Should be moved to success callback of Hydra.js API call ->
      commit('SET_GENERAL_LOADING__GENERAL', false);
      commit('SET_API_CONNECTION_VALID__GENERAL', true);
    } catch (e) {
      console.log(e);
      commit('SET_GENERAL_LOADING__GENERAL', false);
      toast.error(notifications.commonErrorOccurred);
    }
  },
};
