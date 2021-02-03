import { ActionTree } from 'vuex';
import { Api, ApiPromise } from 'hydradx-js';
import { formatBalance } from '@polkadot/util';
import { bnToBn } from '@polkadot/util';

export const actions: ActionTree<GeneralState, MergedState> & GeneralActions = {
  updateBlockHashSMGeneral({ commit }, payload: string | null) {
    commit('SET_BLOCK_HASH__GENERAL', payload);
  },
  updateBlockNumberSMGeneral({ commit }, payload: number) {
    commit('SET_BLOCK_NUMBER__GENERAL', payload);
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

      // INITIALIZE WALLET
      commit('SET_EXTENSION_PRESENT__GENERAL', false);

      try {
        const accountSubscription = await Api.syncWallets(payload => {
          dispatch('updateWalletInfoSMWallet', payload);
        });

        if (accountSubscription) {
          commit('SET_EXTENSION_PRESENT__GENERAL', true);
        }
        commit('SET_EXTENSION_INITIALIZED__GENERAL', true);
      } catch (e) {
        console.log(e);
      }

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
        dispatch('updateTransactionsSMTrade', { events: events });
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
    } catch (e) {
      console.log(e);
    }
  },
};
