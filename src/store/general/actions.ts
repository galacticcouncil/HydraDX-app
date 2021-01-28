import { ActionTree } from 'vuex';
import Api from '@/api';
import { formatBalance } from '@polkadot/util';
import router from '@/router';

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

      const accountSubscription = await Api.syncWallets(
        payload => {
          dispatch('updateWalletInfoSMWallet', payload);
        },
        () => {
          //TODO Add error notice
          console.log('error PD extension connect');
        }
      );

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
    try {
      const apiInstance = await Api.initialize();

      // INITIALIZE HELPERS
      formatBalance.setDefaults({
        decimals: 12,
        unit: '',
      });

      const int = apiInstance.createType('FixedU128', '100000000000000');
      console.log(int.toHuman());

      apiInstance.query.system.events(events => {
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

      await apiInstance.rpc.chain.subscribeNewHeads(header => {
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

      // if (router.currentRoute.value.path === '/') {
      //   await router.push('/wallet');
      // }
    } catch (e) {
      console.log(e);
      commit('SET_GENERAL_LOADING__GENERAL', false);
    }
  },
};
