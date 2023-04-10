import { defaultChainId } from '../config/constants'

export const addRPC = async () => {
  const provider = window.stargate?.wallet?.ethereum?.signer?.provider?.provider ?? window.ethereum
  if (provider) {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${defaultChainId.toString(16)}` }],
      })
      return true
    } catch (switchError) {
      if (switchError?.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${defaultChainId.toString(16)}`,
                chainName: 'BNB Smart Chain',
                nativeCurrency: {
                  name: 'Binance Chain Native Token',
                  symbol: 'BNB',
                  decimals: 18,
                },
                rpcUrls: ['https://bsc-dataseed1.binance.org/'],
                blockExplorerUrls: ['https://bscscan.com/'],
              },
            ],
          })
          return true
        } catch (error) {
          console.error('Failed to setup the network', error)
          return false
        }
      }
      return false
    }
  }
}

// const NetworksData = {
//   56: {
//     chainId: '0x38',
//     chainName: 'Binance Smart Chain Mainnet',
//     nativeCurrency: {
//       name: 'Binance Coin',
//       symbol: 'BNB',
//       decimals: 18,
//     },
//     rpcUrls: ['https://bsc-dataseed1.binance.org/'],
//     blockExplorerUrls: ['https://bscscan.com/'],
//     iconUrls: [],
//   },
//   97: {
//     chainId: '0x61',
//     chainName: 'Binance Smart Chain Testnet',
//     nativeCurrency: {
//       name: 'Binance Coin',
//       symbol: 'tBNB',
//       decimals: 18,
//     },
//     rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
//     blockExplorerUrls: ['https://testnet.bscscan.com/'],
//     iconUrls: [],
//   },
// }
