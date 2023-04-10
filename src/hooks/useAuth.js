import { useCallback } from 'react'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { NoEthereumProviderError, UserRejectedRequestError as UserRejectedRequestErrorInjected } from '@web3-react/injected-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect, WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { ConnectorNames, connectorsByName } from '../utils/connectors'
import { connectorLocalStorageKey } from '../config/constants'
import { addRPC } from '../utils/addRPC'
import { customNotify } from '../utils/notify'

const useAuth = () => {
  const { activate, deactivate } = useWeb3React()
  const login = useCallback(
    (connectorID) => {
      const connector = connectorsByName[connectorID]
      if (connector) {
        if (connectorID === ConnectorNames.Coin98Wallet) {
          if (!window.coin98 && !window.binanceChain && !window.binanceChain?.isCoin98) {
            customNotify('Coin98 Extension is not installed!', 'warn')
            return
          }
        }
        activate(connector, async (error) => {
          if (error instanceof UnsupportedChainIdError) {
            if ([ConnectorNames.MetaMask, ConnectorNames.Coinbase, ConnectorNames.TrustWallet].includes(connectorID)) {
              const hasSetup = await addRPC()
              if (hasSetup) {
                activate(connector)
              }
            } else {
              customNotify('Please connect your wallet to BNB Chain.', 'warn')
            }
          } else {
            window.localStorage.removeItem(connectorLocalStorageKey)
            if (error instanceof NoEthereumProviderError) {
              customNotify('No provider was found', 'error')
            } else if (error instanceof UserRejectedRequestErrorInjected || error instanceof UserRejectedRequestErrorWalletConnect) {
              if (connector instanceof WalletConnectConnector) {
                const walletConnector = connector
                walletConnector.walletConnectProvider = null
              }
              customNotify('User denied account authorization', 'error')
            } else {
              customNotify(error.message, 'error')
            }
          }
        })
      } else {
        customNotify('The connector config is wrong', 'error')
      }
    },
    [activate],
  )

  const logout = useCallback(() => {
    deactivate()
    // This localStorage key is set by @web3-react/walletconnect-connector
    if (window.localStorage.getItem('walletconnect')) {
      connectorsByName[ConnectorNames.WalletConnect].close()
      connectorsByName[ConnectorNames.WalletConnect].walletConnectProvider = null
    }
    window.localStorage.removeItem(connectorLocalStorageKey)
  }, [deactivate])

  return { login, logout }
}

export default useAuth
