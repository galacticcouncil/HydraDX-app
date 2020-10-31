import { ApiPromise, WsProvider } from "@polkadot/api";
import { Signer } from "@polkadot/api/types";
import {
  web3Enable,
  web3AccountsSubscribe,
  web3FromAddress,
} from "@polkadot/extension-dapp";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

let api: ApiPromise | null = null;

const getApi = (): ApiPromise | null => {
  return api;
};

const getSinger = async (account: string): Promise<Signer> => {
  const injector = await web3FromAddress(account);
  return injector.signer;
};

const syncWallets = async (
  updateFunction: (accounts: InjectedAccountWithMeta[]) => void
): Promise<null> => {
  // returns an array of all the injected sources
  // (this needs to be called first, before other requests)
  const allInjected = await web3Enable("HACK.HydraDX.io");

  if (!allInjected.length) {
    return null;
  } else {
    web3AccountsSubscribe(updateFunction);
    return null;
  }
};

const initialize = async (): Promise<ApiPromise> => {
  const local =
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "localhost";

  const serverAddress = local
    ? "ws://127.0.0.1:9944"
    : "wss://hack.hydradx.io:9944";

  const wsProvider = new WsProvider(serverAddress);

  api = await ApiPromise.create({
    provider: wsProvider,
    rpc: {
      amm: {
        getSpotPrice: {
          description: "Get spot price",
          params: [
            {
              name: "asset1",
              type: "AssetId",
            },
            {
              name: "asset2",
              type: "AssetId",
            },
            {
              name: "amount",
              type: "Balance",
            },
          ],
          type: "BalanceInfo",
        },
        getSellPrice: {
          description: "Get AMM sell price",
          params: [
            {
              name: "asset1",
              type: "AssetId",
            },
            {
              name: "asset2",
              type: "AssetId",
            },
            {
              name: "amount",
              type: "Balance",
            },
          ],
          type: "BalanceInfo",
        },
        getBuyPrice: {
          description: "Get AMM buy price",
          params: [
            {
              name: "asset1",
              type: "AssetId",
            },
            {
              name: "asset2",
              type: "AssetId",
            },
            {
              name: "amount",
              type: "Balance",
            },
          ],
          type: "BalanceInfo",
        },
      },
    },
    types: {
      Amount: "i128",
      AmountOf: "Amount",
      Address: "AccountId",
      LookupSource: "AccountId",
      CurrencyId: "AssetId",
      CurrencyIdOf: "AssetId",
      BalanceInfo: {
        amount: "Balance",
        assetId: "AssetId",
      },
      IntentionId: "u128",
      IntentionType: {
        _enum: ["SELL", "BUY"],
      },
      Intention: {
        who: "AccountId",
        asset_sell: "AssetId",
        asset_buy: "AssetId",
        amount: "Balance",
        discount: "bool",
        sell_or_buy: "IntentionType",
      },
      Price: "Balance",
    },
  });

  return api;
};

export default {
  initialize,
  syncWallets,
  getApi,
  getSinger,
};
