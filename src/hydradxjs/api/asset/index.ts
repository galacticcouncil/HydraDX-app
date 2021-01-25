import Api from '../../api';
import { bnToBn, formatBalance } from "@polkadot/util";

async function syncAssetBalancesSMWallet(account: any) {
    const api = Api.getApi();
    const balances: AssetBalance[] = [];

    if (account && api) {
      const multiTokenInfo = await api.query.tokens.accounts.entries(account);
      const baseTokenInfo = await api.query.system.account(account);
      const baseTokenBalance = bnToBn(baseTokenInfo.data.free);

      balances[0] = {
        assetId: 0,
        balance: baseTokenBalance,
        balanceFormatted: formatBalance(baseTokenBalance),
      };
      multiTokenInfo.forEach(record => {
        let assetId = 99999;

        const assetInfo = record[0].toHuman();
        if (Array.isArray(assetInfo) && typeof assetInfo[1] === 'string') {
          assetId = parseInt(assetInfo[1]);
        }

        const assetBalances = api.createType('AccountData', record[1]);
        const balance = bnToBn(assetBalances.free);
        const balanceFormatted = formatBalance(balance);

        balances[assetId] = {
          assetId,
          balance,
          balanceFormatted,
        };
      });
    }

    return balances;
  }

  async function syncAssetListSMWallet() {
    const api = Api.getApi();
    if (!api) return [];
    const assetIds = await api.query.assetRegistry.assetIds.entries();
    const assetList: AssetRecord[] = [{ assetId: 0, name: 'HDX' }];

    // TODO: Better way to parse mapped records
    assetIds.forEach(([assetName, id]) => {
      const assetId = parseInt(api.createType('Option<u32>', id).toString());
      const name = assetName.toHuman()?.toString() || '0xERR';

      assetList[assetId] = { assetId, name };
    });

    return assetList;
  };

  async function mintAssetSMWallet(account: any, assetId: any) {
    const api = Api.getApi();
    
    if (api && account) {
      const signer = await Api.getSinger(account);
      api.tx.faucet
        .mint(assetId, 100000000000000)
        .signAndSend(account, { signer: signer }, ({ events, status }) => {
          if (status.isReady) return Promise.resolve();
          // TODO:STUFF
        });
    }
  }

  export {
    syncAssetBalancesSMWallet,
    syncAssetListSMWallet,
    mintAssetSMWallet,
  }