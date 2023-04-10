import { useWeb3React } from '@web3-react/core'
import { useCallback } from 'react'
import { ethers } from 'ethers'

const useGetMuonSignature = () => {
  const { library } = useWeb3React()
  return useCallback(
    (user, timestamp) => {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      if (!user || !provider) {
        return null
      }
      const signer = provider.getSigner()
      const typedData = {
        types: {
          Message: [
            { type: 'address', name: 'user' },
            { type: 'uint256', name: 'timestamp' },
          ],
        },
        domain: { name: 'Dibs' },
        primaryType: 'Message',
        message: { user, timestamp },
      }
      return signer._signTypedData(typedData.domain, typedData.types, typedData.message)
    },
    [library],
  )
}

export default useGetMuonSignature
