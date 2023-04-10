import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import useRefresh from '../hooks/useRefresh'
import useWeb3 from '../hooks/useWeb3'
import { fetchUserPairs } from '../utils/fetchUserPairs'
import usePrices from '../hooks/usePrices'
import { getPairs } from '../utils/api'
import { ZERO_VALUE } from '../utils/formatNumber'

const PairsContext = React.createContext({
  pairs: [],
  supply: {
    totalSupply: ZERO_VALUE,
    circSupply: ZERO_VALUE,
    lockedSupply: ZERO_VALUE,
  },
})

const PairsContextProvider = ({ children }) => {
  const [pairs, setPairs] = useState([])
  const [supply, setSupply] = useState({
    totalSupply: ZERO_VALUE,
    circSupply: ZERO_VALUE,
    lockedSupply: ZERO_VALUE,
  })
  const { fastRefresh } = useRefresh()
  const { account } = useWeb3React()
  const web3 = useWeb3()
  const prices = usePrices()

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data: pools, meta } = await getPairs()
        const { total_supply, circulating_supply, locked_supply } = meta
        setSupply({
          totalSupply: new BigNumber(total_supply),
          circSupply: new BigNumber(circulating_supply),
          lockedSupply: new BigNumber(locked_supply),
        })
        if (pools.length > 0) {
          var bnbthe = '0x63Db6ba9E512186C2FAaDaCEF342FB4A40dc577c'
          var busdthe = '0x34B897289fcCb43c048b2Cea6405e840a129E021'
          var usdtthe = '0xA051eF9A6FBea340Bb734d022e7B6a3aD9fD9B06'
          let userInfos = []
          if (account) {
            userInfos = await fetchUserPairs(web3, account)
          }
          const userInfo = pools
            .map((pair) => {
              const found = userInfos.find((item) => item.address.toLowerCase() === pair.address.toLowerCase())
              let user = {
                lpBalance: ZERO_VALUE,
                gaugeBalance: ZERO_VALUE,
                gaugeEarned: ZERO_VALUE,
                totalLp: ZERO_VALUE,
                token0claimable: ZERO_VALUE,
                token1claimable: ZERO_VALUE,
                staked0: ZERO_VALUE,
                staked1: ZERO_VALUE,
                stakedUsd: ZERO_VALUE,
                earnedUsd: ZERO_VALUE,
                total0: ZERO_VALUE,
                total1: ZERO_VALUE,
                totalUsd: ZERO_VALUE,
              }
              if (found) {
                const lpPrice = new BigNumber(pair.totalSupply).isZero() ? ZERO_VALUE : new BigNumber(pair.tvl).div(pair.totalSupply)
                user = {
                  ...found,
                  staked0: pair.totalSupply ? found.gaugeBalance.times(pair.token0.reserve).div(pair.totalSupply) : ZERO_VALUE,
                  staked1: pair.totalSupply ? found.gaugeBalance.times(pair.token1.reserve).div(pair.totalSupply) : ZERO_VALUE,
                  stakedUsd: found.gaugeBalance.times(lpPrice),
                  earnedUsd: found.gaugeEarned.times(prices['THE']),
                  total0: pair.totalSupply ? found.totalLp.times(pair.token0.reserve).div(pair.totalSupply) : ZERO_VALUE,
                  total1: pair.totalSupply ? found.totalLp.times(pair.token1.reserve).div(pair.totalSupply) : ZERO_VALUE,
                  totalUsd: found.totalLp.times(lpPrice),
                }
              }
              return {
                ...pair,
                stable: pair.isStable,
                tvl: new BigNumber(pair.tvl),
                token0: {
                  ...pair.token0,
                  reserve: new BigNumber(pair.token0.reserve),
                },
                token1: {
                  ...pair.token1,
                  reserve: new BigNumber(pair.token1.reserve),
                },
                gauge: {
                  ...pair.gauge,
                  tvl: new BigNumber(pair.gauge.tvl),
                  apr: new BigNumber(pair.gauge.apr),
                  voteApr: new BigNumber(pair.gauge.voteApr),
                  projectedApr: new BigNumber(pair.gauge.projectedApr),
                  weight: new BigNumber(pair.gauge.weight),
                  weightPercent: new BigNumber(pair.gauge.weightPercent),
                  bribeUsd: new BigNumber(pair.gauge.bribesInUsd),
                  pooled0: pair.totalSupply ? new BigNumber(pair.token0.reserve).times(pair.gauge.totalSupply).div(pair.totalSupply) : new BigNumber(0),
                  pooled1: pair.totalSupply ? new BigNumber(pair.token1.reserve).times(pair.gauge.totalSupply).div(pair.totalSupply) : new BigNumber(0),
                },
                account: user,
              }
            })
            .sort((a, b) => {
              return a.gauge.tvl.minus(b.gauge.tvl).times(-1).toNumber()
            })
            .sort(function (x, y) {
              return x.address == busdthe ? -1 : y.address == busdthe ? 1 : 0
            })
            .sort(function (x, y) {
              return x.address == bnbthe ? -1 : y.address == bnbthe ? 1 : 0
            })
            .sort(function (x, y) {
              return x.address == usdtthe ? -1 : y.address == usdtthe ? 1 : 0
            })
          setPairs(userInfo)
        }
      } catch (e) {
        console.error('user pairs fetched had error', e)
      }
    }
    if (web3) {
      getUserData()
    }
  }, [account, web3, fastRefresh])

  return (
    <PairsContext.Provider
      value={{
        pairs,
        supply,
      }}
    >
      {children}
    </PairsContext.Provider>
  )
}

export { PairsContext, PairsContextProvider }
