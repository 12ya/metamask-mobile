import { NetworkType, toHex } from '@metamask/controller-utils';

export const MAINNET = 'mainnet';
export const HOMESTEAD = 'homestead';
export const GOERLI = 'goerli';
export const SEPOLIA = 'sepolia';
export const LINEA_GOERLI = 'linea-goerli';
export const LINEA_SEPOLIA = 'linea-sepolia';
export const LINEA_MAINNET = 'linea-mainnet';
export const RPC = NetworkType.rpc;
export const NO_RPC_BLOCK_EXPLORER = 'NO_BLOCK_EXPLORER';
export const PRIVATENETWORK = 'PRIVATENETWORK';
export const DEFAULT_MAINNET_CUSTOM_NAME = 'Ethereum Main Custom';
export const IPFS_DEFAULT_GATEWAY_URL = 'https://cloudflare-ipfs.com/ipfs/';

/**
 * @enum {string}
 */
export const NETWORKS_CHAIN_ID = {
  MAINNET: toHex('1'),
  OPTIMISM: toHex('10'),
  BSC: toHex('56'),
  POLYGON: toHex('137'),
  FANTOM: toHex('250'),
  BASE: toHex('8453'),
  ARBITRUM: toHex('42161'),
  AVAXCCHAIN: toHex('43114'),
  CELO: toHex('42220'),
  HARMONY: toHex('1666600000'),
  SEPOLIA: toHex('11155111'),
  LINEA_GOERLI: toHex('59140'),
  LINEA_SEPOLIA: toHex('59141'),
  GOERLI: toHex('5'),
  LINEA_MAINNET: toHex('59144'),
  ZKSYNC_ERA: toHex('324'),
  ARBITRUM_GOERLI: toHex('421613'),
  OPTIMISM_GOERLI: toHex('420'),
  MUMBAI: toHex('80001'),
  OPBNB: toHex('204'),
  SCROLL: toHex('534352'),
  BERACHAIN: toHex('80085'),
  METACHAIN_ONE: toHex('112358'),
};

// To add a deprecation warning to a network, add it to the array
export const DEPRECATED_NETWORKS = [
  NETWORKS_CHAIN_ID.GOERLI,
  NETWORKS_CHAIN_ID.ARBITRUM_GOERLI,
  NETWORKS_CHAIN_ID.OPTIMISM_GOERLI,
  NETWORKS_CHAIN_ID.LINEA_GOERLI,
  NETWORKS_CHAIN_ID.MUMBAI,
];
export const CHAINLIST_CURRENCY_SYMBOLS_MAP = {
  MAINNET: 'ETH',
  OPTIMISM: 'ETH',
  BNB: 'BNB',
  MATIC: 'MATIC',
  FANTOM_OPERA: 'FTM',
  BASE: 'ETH',
  ARBITRUM: 'ETH',
  AVALANCHE: 'AVAX',
  CELO: 'CELO',
  HARMONY: 'ONE',
  SEPOLIA: 'SepoliaETH',
  LINEA_GOERLI: 'LineaETH',
  LINEA_SEPOLIA: 'LineaETH',
  GOERLI: 'GoerliETH',
  LINEA_MAINNET: 'ETH',
  ZKSYNC_ERA: 'ETH',
};

export const CURRENCY_SYMBOL_BY_CHAIN_ID = {
  [NETWORKS_CHAIN_ID.MAINNET]: CHAINLIST_CURRENCY_SYMBOLS_MAP.MAINNET,
  [NETWORKS_CHAIN_ID.OPTIMISM]: CHAINLIST_CURRENCY_SYMBOLS_MAP.OPTIMISM,
  [NETWORKS_CHAIN_ID.BSC]: CHAINLIST_CURRENCY_SYMBOLS_MAP.BNB,
  [NETWORKS_CHAIN_ID.POLYGON]: CHAINLIST_CURRENCY_SYMBOLS_MAP.MATIC,
  [NETWORKS_CHAIN_ID.FANTOM]: CHAINLIST_CURRENCY_SYMBOLS_MAP.FANTOM_OPERA,
  [NETWORKS_CHAIN_ID.BASE]: CHAINLIST_CURRENCY_SYMBOLS_MAP.BASE,
  [NETWORKS_CHAIN_ID.ARBITRUM]: CHAINLIST_CURRENCY_SYMBOLS_MAP.ARBITRUM,
  [NETWORKS_CHAIN_ID.AVAXCCHAIN]: CHAINLIST_CURRENCY_SYMBOLS_MAP.AVALANCHE,
  [NETWORKS_CHAIN_ID.CELO]: CHAINLIST_CURRENCY_SYMBOLS_MAP.CELO,
  [NETWORKS_CHAIN_ID.HARMONY]: CHAINLIST_CURRENCY_SYMBOLS_MAP.HARMONY,
  [NETWORKS_CHAIN_ID.SEPOLIA]: CHAINLIST_CURRENCY_SYMBOLS_MAP.SEPOLIA,
  [NETWORKS_CHAIN_ID.LINEA_GOERLI]: CHAINLIST_CURRENCY_SYMBOLS_MAP.LINEA_GOERLI,
  [NETWORKS_CHAIN_ID.LINEA_SEPOLIA]:
    CHAINLIST_CURRENCY_SYMBOLS_MAP.LINEA_SEPOLIA,
  [NETWORKS_CHAIN_ID.GOERLI]: CHAINLIST_CURRENCY_SYMBOLS_MAP.GOERLI,
  [NETWORKS_CHAIN_ID.LINEA_MAINNET]:
    CHAINLIST_CURRENCY_SYMBOLS_MAP.LINEA_MAINNET,
  [NETWORKS_CHAIN_ID.ZKSYNC_ERA]: CHAINLIST_CURRENCY_SYMBOLS_MAP.ZKSYNC_ERA,
};

export const TEST_NETWORK_IDS = [
  NETWORKS_CHAIN_ID.GOERLI,
  NETWORKS_CHAIN_ID.SEPOLIA,
  NETWORKS_CHAIN_ID.LINEA_GOERLI,
  NETWORKS_CHAIN_ID.LINEA_SEPOLIA,
];
