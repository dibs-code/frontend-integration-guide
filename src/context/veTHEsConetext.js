import { useWeb3React } from '@web3-react/core'
import React, { useState, useEffect } from 'react'
import useRefresh from '../hooks/useRefresh'
import useWeb3 from '../hooks/useWeb3'
import { fetchUserVeTHEs } from '../utils/fetchUserVeTHEs'

const veTHEsContext = React.createContext([])

const VeTHEsContextProvider = ({ children }) => {
  const [veTHEs, setVeTHEs] = useState([])

  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const web3 = useWeb3()

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserVeTHEs(web3, account)
        setVeTHEs(data)
      } catch (e) {
        console.error('user veTHEs fetched had error', e)
      }
    }
    if (account) {
      getUserData()
    } else {
      setVeTHEs([])
    }
  }, [account, fastRefresh])

  return <veTHEsContext.Provider value={veTHEs}>{children}</veTHEsContext.Provider>
}

export { veTHEsContext, VeTHEsContextProvider }
