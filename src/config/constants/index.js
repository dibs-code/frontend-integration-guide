import { ConnectorNames } from '../../utils/connectors'

const connectorLocalStorageKey = 'thena-local-key'
// eslint-disable-next-line no-use-before-define
const defaultChainId = Number(process.env.REACT_APP_CHAIN_ID)
const privateSaleStartTimeStamp = 1669993200

const REACT_APP_MUON_API_URL = 'https://dibs-shield.muon.net/'

const TransactionType = {
  START: 'start',
  WAITING: 'waiting',
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
}

const LotteryStatus = {
  UNKNOWN: 0,
  WON: 1,
  LOST: 2,
}

const connectors = [
  {
    key: 'metamask',
    logo: '/images/wallets/metamask-logo.svg',
    title: 'MetaMask',
    connector: ConnectorNames.MetaMask,
  },
  {
    key: 'trustwallet',
    logo: '/images/wallets/trustwallet-logo.svg',
    title: 'Trust Wallet',
    connector: ConnectorNames.TrustWallet,
  },
  {
    key: 'walletConnect',
    logo: '/images/wallets/walletconnect-logo.svg',
    title: 'Wallet Connect',
    connector: ConnectorNames.WalletConnect,
  },
  {
    key: 'coinbase',
    logo: '/images/wallets/coinbase-wallet-logo.svg',
    title: 'Coinbase Wallet',
    connector: ConnectorNames.Coinbase,
  },
  {
    key: 'binance',
    logo: '/images/wallets/binance-wallet-logo.svg',
    title: 'Binance Wallet',
    connector: ConnectorNames.BinanceChainWallet,
  },
  {
    key: 'coin98',
    logo: '/images/wallets/coin98-wallet-logo.svg',
    title: 'Coin98 Wallet',
    connector: ConnectorNames.Coin98Wallet,
  },
]

const routeAssets = [
  {
    name: 'Wrapped BNB',
    symbol: 'WBNB',
    address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    chainId: 56,
    decimals: 18,
    logoURI: 'https://thena.fi/images/tokens/WBNB.png',
  },
  {
    name: 'BUSD Token',
    symbol: 'BUSD',
    address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    chainId: 56,
    decimals: 18,
    logoURI: 'https://thena.fi/images/tokens/BUSD.png',
  },
  {
    name: 'USD Coin',
    symbol: 'USDC',
    address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    chainId: 56,
    decimals: 18,
    logoURI: 'https://thena.fi/images/tokens/USDC.png',
  },
  {
    name: 'Tether USD',
    symbol: 'USDT',
    address: '0x55d398326f99059fF775485246999027B3197955',
    chainId: 56,
    decimals: 18,
    logoURI: 'https://thena.fi/images/tokens/USDT.png',
  },
  {
    name: 'Frax',
    symbol: 'FRAX',
    address: '0x90c97f71e18723b0cf0dfa30ee176ab653e89f40',
    chainId: 56,
    decimals: 18,
    logoURI: 'https://thena.fi/images/tokens/FRAX.png',
  },
  {
    name: 'Liquid Staking BNB',
    symbol: 'BNBx',
    address: '0x1bdd3cf7f79cfb8edbb955f20ad99211551ba275',
    chainId: 56,
    decimals: 18,
    logoURI: 'https://thena.fi/images/tokens/BNBx.png',
  },
  {
    name: 'Coin98 Dollar',
    symbol: 'CUSD',
    address: '0xFa4BA88Cf97e282c505BEa095297786c16070129',
    chainId: 56,
    decimals: 18,
    logoURI: 'https://thena.fi/images/tokens/CUSD.png',
  },
  {
    name: 'Hay Destablecoin',
    symbol: 'HAY',
    address: '0x0782b6d8c4551B9760e74c0545a9bCD90bdc41E5',
    chainId: 56,
    decimals: 18,
    logoURI: 'https://thena.fi/images/tokens/HAY.png',
  },
  {
    name: 'USD+',
    symbol: 'USD+',
    address: '0xe80772eaf6e2e18b651f160bc9158b2a5cafca65',
    chainId: 56,
    decimals: 6,
    logoURI: 'https://thena.fi/images/tokens/USD+.png',
  },
  {
    name: 'Staked BNB',
    symbol: 'stkBNB',
    address: '0xc2e9d07f66a89c44062459a47a0d2dc038e4fb16',
    chainId: 56,
    decimals: 18,
    logoURI: 'https://thena.fi/images/tokens/stkBNB.png',
  },
  {
    name: 'Ankr Reward Bearing BNB',
    symbol: 'ankrBNB',
    address: '0x52F24a5e03aee338Da5fd9Df68D2b6FAe1178827',
    chainId: 56,
    decimals: 18,
    logoURI: 'https://thena.fi/images/tokens/ankrBNB.png',
  },
  {
    name: 'THENA',
    symbol: 'THE',
    address: '0xF4C8E32EaDEC4BFe97E0F595AdD0f4450a863a11',
    chainId: 56,
    decimals: 18,
    logoURI: 'https://thena.fi/logo.png',
  },
]
const periodLevels = [
  {
    value: 0,
    label: '2 weeks',
  },
  {
    value: 1,
    label: '6 months',
  },
  {
    value: 2,
    label: '1 year',
  },
  {
    value: 3,
    label: '2 years',
  },
]

const NumberOfRows = [10, 20, 30, 40]
const PoolTypes = ['ALL', 'STABLE', 'VOLATILE']
const ReferralTabs = ['code', 'rewards', 'leaderboard', 'lottery']
const TaxAssets = [
  '0x74ccbe53f77b08632ce0cb91d3a545bf6b8e0979', // fBOMB
  '0xc95cd75dcea473a30c8470b232b36ee72ae5dcc2', // CHAM
  '0x3a806a3315e35b3f5f46111adb6e2baf4b14a70d', // LIBERA
  '0x9a7b04fd5788ea39819723e7eb9ef5f609bc57ab', // cpTHE
]
const NewPools = [
  '0xd714206a7D63F5a2d613064815995E9CC7061988', // vAMM-UNW/THE
  '0x2475FF2A7C81da27eA2e08e0d3B0Ad01e16225eC', // sAMM-BTCB/multiBTC
]

export {
  connectorLocalStorageKey,
  defaultChainId,
  privateSaleStartTimeStamp,
  connectors,
  TransactionType,
  routeAssets,
  periodLevels,
  NumberOfRows,
  PoolTypes,
  LotteryStatus,
  REACT_APP_MUON_API_URL,
  TaxAssets,
  ReferralTabs,
  NewPools,
}
