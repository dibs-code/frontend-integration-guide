import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { BscConnector } from '@binance-chain/bsc-connector'
import getNodeUrl from './getRpcUrl'

const POLLING_INTERVAL = 12000
const rpcUrl = getNodeUrl()
const defaultChainId = process.env.REACT_APP_CHAIN_ID

const supportedChainIds = [Number(defaultChainId)]

export const injected = new InjectedConnector({
  supportedChainIds,
})

const walletconnect = new WalletConnectConnector({
  rpc: { [defaultChainId]: rpcUrl },
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
})

const walletlink = new WalletLinkConnector({
  url: rpcUrl,
  appName: 'Thena',
  supportedChainIds: supportedChainIds,
})

const binanceChainWalletConnector = new BscConnector({ supportedChainIds })

export const ConnectorNames = {
  MetaMask: 'MetaMask',
  TrustWallet: 'TrustWallet',
  WalletConnect: 'WalletConnect',
  Coinbase: 'Coinbase',
  BinanceChainWallet: 'BinanceChainWallet',
  Coin98Wallet: 'Coin98Wallet',
}

export const connectorsByName = {
  [ConnectorNames.MetaMask]: injected,
  [ConnectorNames.TrustWallet]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.Coinbase]: walletlink,
  [ConnectorNames.BinanceChainWallet]: binanceChainWalletConnector,
  [ConnectorNames.Coin98Wallet]: injected,
}
