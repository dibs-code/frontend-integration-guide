import { multicall } from './multicall'
import { fromWei } from './formatNumber'
import { ERC20Abi } from '../config/abi'

const fetchAssetsBalances = async (baseAssets, account) => {
  const calls = baseAssets.map((asset) => {
    return {
      address: asset.address,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(ERC20Abi, calls)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance, index) => {
    return fromWei(tokenBalance, baseAssets[index].decimals || 18)
  })
  return parsedTokenBalances
}

export const fetchUserAssetsDataAsync = async (web3, baseAssets, account) => {
  const nonBnbAssets = baseAssets.slice(1)
  const [bnbBalance, userBalances] = await Promise.all([web3.eth.getBalance(account), fetchAssetsBalances(nonBnbAssets, account)])

  const bnbAssetInfo = {
    ...baseAssets[0],
    balance: fromWei(bnbBalance),
  }

  const nonBnbAssetsInfo = nonBnbAssets.map((asset, index) => {
    return {
      ...asset,
      balance: userBalances[index],
    }
  })
  return [bnbAssetInfo, ...nonBnbAssetsInfo]
}
