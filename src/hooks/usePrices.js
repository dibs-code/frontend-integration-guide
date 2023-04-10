import { useContext, useEffect, useState } from 'react'
import { getETHAddress, getTHEAddress, getWBNBAddress } from '../utils/addressHelpers'
import { BaseAssetsConetext } from '../context/BaseAssetsConetext'

const usePrices = () => {
  const [prices, setPrices] = useState({
    THE: 0,
    BNB: 0,
    ETH: 0,
  })
  const baseAssets = useContext(BaseAssetsConetext)

  useEffect(() => {
    if (baseAssets.length > 0) {
      const theAsset = baseAssets.find((asset) => asset.address.toLowerCase() === getTHEAddress().toLowerCase())
      const bnbAsset = baseAssets.find((asset) => asset.address.toLowerCase() === getWBNBAddress().toLowerCase())
      const ethAsset = baseAssets.find((asset) => asset.address.toLowerCase() === getETHAddress().toLowerCase())
      setPrices({
        THE: theAsset ? theAsset.price : 0,
        BNB: bnbAsset ? bnbAsset.price : 0,
        ETH: ethAsset ? ethAsset.price : 0,
      })
    }
  }, [baseAssets])

  return prices
}

export default usePrices
