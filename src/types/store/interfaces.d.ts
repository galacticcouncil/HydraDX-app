// import { ActionContext } from 'vuex';
// type BN = import('bn.js');
// import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
//
// import { MutationTypes as WalletMTypes } from '@/store/modules/wallet/mutation-types';
// import { ActionTypes as WalletATypes } from '@/store/modules/wallet/action-types';
// import { MutationTypes as RootMTypes } from '@/store/modules/root/mutation-types';
// import { ActionTypes as RootATypes } from '@/store/modules/root/action-types';
//
// export interface IRootState {
//   blockHash: string | null;
//   blockNumber: number;
// }
// // TODO refactor from here CounterStateTypes -> AccountStateTypes
// export interface IMergedState extends IRootState {
//   wallet: WalletStateTypes;
// }
//
// export interface IRootGettersTypes {
//   getBlockHash(state: IRootState): string | null;
//   getBlockNumber(state: IRootState): number;
// }
//
// export type RootMutationsTypes<S = IRootState> = {
//   [RootMTypes.SET_BLOCK_NUMBER](state: S, payload: number): void;
//   [RootMTypes.SET_BLOCK_HASH](state: S, payload: string | null): void;
// };
//
// type AugmentedActionContextRoot = {
//   commit<K extends keyof RootMutationsTypes>(
//     key: K,
//     payload: Parameters<RootMutationsTypes[K]>[1]
//   ): ReturnType<RootMutationsTypes[K]>;
// } & Omit<ActionContext<IRootState, IRootState>, 'commit'>;
//
// export interface RootActionsTypes {
//   [RootATypes.UPDATE_BLOCK_HASH](
//     { commit }: AugmentedActionContextRoot,
//     payload: string | null
//   ): void;
//   [RootATypes.UPDATE_BLOCK_NUMBER](
//     { commit }: AugmentedActionContextRoot,
//     payload: number
//   ): void;
// }
//
// /*********************** WALLET MODULE TYPES  ***********************/
// type AccountInfo = {
//   name: string;
//   address: string;
// };
// type AssetBalance = {
//   assetId: number;
//   balance: BN;
//   balanceFormatted: string;
// };
// type AssetRecord = {
//   assetId: number;
//   name: string;
//   icon?: string;
// };
//
// export interface WalletStateTypes {
//   account: string | null;
//   accountList: AccountInfo[];
//   assetBalances: AssetBalance[];
//   assetList: AssetRecord[];
// }
//
// export interface WalletGettersTypes {
//   account(state: WalletStateTypes): string | null;
//   accountInfo(state: WalletStateTypes): AccountInfo;
//   accountList(state: WalletStateTypes): AccountInfo[];
//   assetBalances(state: WalletStateTypes): AssetBalance[];
//   assetList(state: WalletStateTypes): AssetRecord[];
// }
//
// export type WalletMutationsTypes<S = WalletStateTypes> = {
//   [WalletMTypes.SET_ACCOUNT](state: S, account: string | null): void;
//   [WalletMTypes.SET_ACCOUNT_LIST](state: S, accountList: AccountInfo[]): void;
//   [WalletMTypes.SET_ASSET_BALANCES](
//     state: S,
//     assetBalances: AssetBalance[]
//   ): void;
// };
//
// export type AugmentedActionContextWallet = {
//   commit<K extends keyof WalletMutationsTypes>(
//     key: K,
//     payload: Parameters<WalletMutationsTypes[K]>[1]
//   ): ReturnType<WalletMutationsTypes[K]>;
// } & Omit<ActionContext<WalletStateTypes, IRootState>, 'commit'>;
//
// export interface WalletActionsTypes {
//   [WalletATypes.CHANGE_ACCOUNT](
//     { commit }: AugmentedActionContextWallet,
//     account: string | null
//   ): void;
//   [WalletATypes.UPDATE_WALLET_INFO](
//     { commit, dispatch, state, rootState }: AugmentedActionContextWallet,
//     accountsWithMeta: InjectedAccountWithMeta[]
//   ): void;
// }
//
// export interface StoreActions extends RootActionsTypes, WalletActionsTypes {}
// export interface StoreGetters extends IRootGettersTypes, WalletGettersTypes {}
