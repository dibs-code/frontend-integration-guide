import { useWeb3React } from '@web3-react/core'
import React, { useState, useEffect } from 'react'
import useRefresh from '../hooks/useRefresh'
import useWeb3 from '../hooks/useWeb3'
import { getBaseAssets } from '../utils/api'
import { fetchUserAssetsDataAsync } from '../utils/fetchUserAssets'

const BaseAssetsConetext = React.createContext([])

const BaseAssetsConetextProvider = ({ children }) => {
  const [baseAssets, setBaseAssets] = useState([])
  const { fastRefresh } = useRefresh()
  const web3 = useWeb3()
  const { account } = useWeb3React()

  useEffect(() => {
    getBaseAssets()
      .then(async (res) => {
        if (res) {
          if (web3 && account) {
            try {
              const data = await fetchUserAssetsDataAsync(web3, res, account)
              const sortedData = data.sort((a, b) => {
                if (a.balance.times(a.price).lt(b.balance.times(b.price))) return 1
                if (a.balance.times(a.price).gt(b.balance.times(b.price))) return -1
              })
              setBaseAssets(sortedData)
            } catch (e) {
              console.error('User Assets fetch had error', e)
              setBaseAssets(res)
            }
          } else {
            setBaseAssets(res)
          }
        }
      })
      .catch((error) => {
        console.error('Base Assets fetched had error', error)
      })
  }, [fastRefresh, web3, account])

  return <BaseAssetsConetext.Provider value={baseAssets}>{children}</BaseAssetsConetext.Provider>
}

export { BaseAssetsConetext, BaseAssetsConetextProvider }
