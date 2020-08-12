import { ApiPromise, WsProvider } from "@polkadot/api";
import {
  web3Enable,
  web3AccountsSubscribe,
  web3FromAddress
} from "@polkadot/extension-dapp";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

let api: ApiPromise | null = null;

const getApi = () => {
  return api;
};

const getSinger = async (account: string) => {
  const injector = await web3FromAddress(account);
  return injector.signer;
};

const syncWallets = async (
  updateFunction: (accounts: InjectedAccountWithMeta[]) => void
) => {
  // returns an array of all the injected sources
  // (this needs to be called first, before other requests)
  const allInjected = await web3Enable("HACK.HydraDX.io");

  if (!allInjected.length) {
    return null;
  } else {
    return web3AccountsSubscribe(updateFunction);
  }
};

const initialize = async () => {
  const wsProvider = new WsProvider("ws://127.0.0.1:9944");

  /* eslint-disable @typescript-eslint/camelcase */

  api = await ApiPromise.create({
    provider: wsProvider,
    types: {
      Amount: "i128",
      AmountOf: "Amount",
      Address: "AccountId",
      LookupSource: "AccountId",
      CurrencyId: "AssetId",
      CurrencyIdOf: "AssetId",
      Intention: {
        who: "AccountId",
        asset_sell: "AssetId",
        asset_buy: "AssetId",
        amount: "Balance",
        discount: "bool",
        sell_or_buy: "IntentionType"
      }
    }
  });

  return api;
};

export default {
  initialize,
  syncWallets,
  getApi,
  getSinger
};
