import { useCallback, useContext, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import useRefresh from './useRefresh'
import { useRewardsApi, useVeDist, useVoter } from './useContract'
import { PairsContext } from '../context/PairsContext'
import { bribeAbi, rewardAPIAbi, veTHEAPIAbi } from '../config/abi'
import { multicall } from '../utils/multicall'
import { fromWei, ZERO_ADDRESS } from '../utils/formatNumber'
import { getRewardsAPIAddress, getVeTHEAPIAddress } from '../utils/addressHelpers'
import BigNumber from 'bignumber.js'
import { BaseAssetsConetext } from '../context/BaseAssetsConetext'
import { useDispatch } from 'react-redux'
import { getBribeContract, getPairContract } from '../utils/contractHelpers'
import useWeb3 from './useWeb3'
import { v4 as uuidv4 } from 'uuid'
import { completeTransaction, openTransaction, updateTransaction } from '../state/transactions/actions'
import { TransactionType } from '../config/constants'
import { sendContract } from '../utils/api'

const useGetVeRewards = (veTHE) => {
  const [rewards, setRewards] = useState([])
  const { fastRefresh } = useRefresh()
  const { pairs } = useContext(PairsContext)
  const baseAssets = useContext(BaseAssetsConetext)

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const callsRewards = pairs
          .filter((pool) => pool.gauge.address !== ZERO_ADDRESS && pool.isValid)
          .map((pool) => {
            return {
              address: getVeTHEAPIAddress(),
              name: 'singlePairReward',
              params: [veTHE.id, pool.address],
            }
          })
        const resRewards = await multicall(veTHEAPIAbi, callsRewards)
        const final = pairs
          .filter((pool) => pool.gauge.address !== ZERO_ADDRESS && pool.isValid)
          .map((pool, index) => {
            const result = {}
            let isFeeExist = false
            let isBribeExist = false
            resRewards[index][0].forEach((reward, idx) => {
              const { 1: amount, 2: decimals, 4: address } = reward
              if (idx < 2) {
                isFeeExist = isFeeExist || Number(amount) > 0
              } else {
                isBribeExist = isBribeExist || Number(amount) > 0
              }
              if (Number(amount) > 0) {
                result[address] = {
                  address,
                  amount: !result[address] ? fromWei(Number(amount), decimals) : result[address]['amount'].plus(fromWei(Number(amount), decimals)),
                }
              }
            })
            return {
              ...pool,
              rewards: Object.values(result),
              isFeeExist,
              isBribeExist,
            }
          })
          .filter((pool) => pool.rewards.length > 0)
          .map((pool) => {
            let votes = {
              weight: new BigNumber(0),
              weightPercent: new BigNumber(0),
            }
            if (veTHE.votes.length > 0) {
              const found = veTHE.votes.find((ele) => ele.address.toLowerCase() === pool.address.toLowerCase())
              if (found) {
                votes = found
              }
            }
            let totalUsd = new BigNumber(0)
            const finalRewards = pool.rewards.map((reward) => {
              const found = baseAssets.find((ele) => ele.address.toLowerCase() === reward.address.toLowerCase())
              if (found) {
                totalUsd = totalUsd.plus(reward.amount.times(found.price))
                return {
                  ...reward,
                  symbol: found.symbol,
                }
              }
              return reward
            })
            return {
              ...pool,
              rewards: finalRewards,
              totalUsd,
              votes,
            }
          })
        setRewards(final)
      } catch (error) {
        console.log('current rewards error :>> ', error)
        setRewards([])
      }
    }

    if (pairs.length > 0 && veTHE) {
      fetchRewards()
    } else {
      setRewards([])
    }
  }, [pairs, baseAssets, fastRefresh, veTHE])

  return rewards
}

const useExpectedRewards = (veTHE) => {
  const [rewards, setRewards] = useState([])
  const { fastRefresh } = useRefresh()
  const { pairs } = useContext(PairsContext)
  const baseAssets = useContext(BaseAssetsConetext)
  const rewardsApiContract = useRewardsApi()

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const gaugePools = pairs.filter((pool) => pool.gauge.address !== ZERO_ADDRESS)
        const callsRewards = gaugePools.map((pool) => {
          const arr = []
          arr.push(pool.address)
          return {
            address: getRewardsAPIAddress(),
            name: 'getExpectedClaimForNextEpoch',
            params: [veTHE.id, arr],
          }
        })
        const resRewards = await multicall(rewardAPIAbi, callsRewards)
        const final = gaugePools
          .map((pool, index) => {
            let result = {}
            // bribes
            const { 0: tokens, 2: decimals, 3: amounts } = resRewards[index][0][0][0][0]
            tokens.map((token, index) => {
              if (Number(amounts[index]) > 0) {
                result[token] = {
                  address: token,
                  amount: !result[token]
                    ? fromWei(Number(amounts[index]), Number(decimals[index]))
                    : result[token]['amount'].plus(fromWei(Number(amounts[index]), Number(decimals[index]))),
                }
              }
            })

            // fees
            const { 0: feeTokens, 2: feeDecimals, 3: feeAmounts } = resRewards[index][0][0][0][1]
            feeTokens.map((token, index) => {
              if (Number(feeAmounts[index]) > 0) {
                result[token] = {
                  address: token,
                  amount: !result[token]
                    ? fromWei(Number(feeAmounts[index]), Number(feeDecimals[index]))
                    : result[token]['amount'].plus(fromWei(Number(feeAmounts[index]), Number(feeDecimals[index]))),
                }
              }
            })
            return {
              ...pool,
              rewards: Object.values(result),
            }
          })
          .filter((pool) => pool.rewards.length > 0)
          .map((pool) => {
            let totalUsd = new BigNumber(0)
            const finalRewards = pool.rewards.map((reward) => {
              const found = baseAssets.find((ele) => ele.address.toLowerCase() === reward.address.toLowerCase())
              if (found) {
                totalUsd = totalUsd.plus(reward.amount.times(found.price))
                return {
                  ...reward,
                  symbol: found.symbol,
                }
              }
              return reward
            })
            return {
              ...pool,
              rewards: finalRewards,
              totalUsd,
            }
          })
        setRewards(final)
      } catch (error) {
        console.log('expected rewards error :>> ', error)
        setRewards([])
      }
    }

    if (pairs.length > 0 && veTHE) {
      fetchRewards()
    } else {
      setRewards([])
    }
  }, [pairs, rewardsApiContract, baseAssets, fastRefresh, veTHE])

  return rewards
}

const useGetFees = () => {
  const [fees, setFees] = useState([])
  const { fastRefresh } = useRefresh()
  const { account } = useWeb3React()
  const { pairs } = useContext(PairsContext)
  const baseAssets = useContext(BaseAssetsConetext)

  useEffect(() => {
    const fetchRewards = () => {
      try {
        const result = pairs
          .filter((pool) => !pool.account.token0claimable.isZero() || !pool.account.token1claimable.isZero())
          .map((pool) => {
            const found0 = baseAssets.find((ele) => ele.address.toLowerCase() === pool.token0.address.toLowerCase())
            const found1 = baseAssets.find((ele) => ele.address.toLowerCase() === pool.token1.address.toLowerCase())
            const totalUsd = pool.account.token0claimable.times(found0?.price).plus(pool.account.token1claimable.times(found1?.price))
            return {
              ...pool,
              totalUsd,
            }
          })
        setFees(result)
      } catch (error) {
        console.log('fees error :>> ', error)
        setFees([])
      }
    }

    if (pairs.length > 0 && account) {
      fetchRewards()
    } else {
      setFees([])
    }
  }, [fastRefresh, account, pairs, baseAssets])

  return fees
}

const useClaimBribes = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()

  const handleClaimBribes = useCallback(
    async (pool, veTHE) => {
      const key = uuidv4()
      // fees claim
      const callsFees = pool.rewards.map((reward) => {
        return {
          address: pool.gauge.fee,
          name: 'earned',
          params: [veTHE.id, reward.address],
        }
      })
      // bribes claim
      const callsBribes = pool.rewards.map((reward) => {
        return {
          address: pool.gauge.bribe,
          name: 'earned',
          params: [veTHE.id, reward.address],
        }
      })
      const [resFees, resBribes] = await Promise.all([multicall(bribeAbi, callsFees), multicall(bribeAbi, callsBribes)])
      const feeTokens = []
      resFees.forEach((item, index) => {
        if (Number(item) > 0) feeTokens.push(pool.rewards[index].address)
      })
      const bribeTokens = []
      resBribes.forEach((item, index) => {
        if (Number(item) > 0) bribeTokens.push(pool.rewards[index].address)
      })
      const result = {}
      const bribesuuid = uuidv4()
      const feeuuid = uuidv4()
      if (bribeTokens.length > 0) {
        result[bribesuuid] = {
          desc: `Claim Bribes`,
          status: TransactionType.START,
          hash: null,
        }
      }
      if (feeTokens.length > 0) {
        result[feeuuid] = {
          desc: `Claim Fees`,
          status: TransactionType.START,
          hash: null,
        }
      }
      dispatch(
        openTransaction({
          key,
          title: `Claim Bribes + Fees for ${pool.symbol}`,
          transactions: result,
        }),
      )
      if (bribeTokens.length > 0) {
        const bribeContract = getBribeContract(web3, pool.gauge.bribe)
        const params = [veTHE.id, bribeTokens]
        setPending(true)
        try {
          await sendContract(dispatch, key, bribesuuid, bribeContract, 'getReward', params, account)
        } catch (err) {
          console.log('bribes claim error :>> ', err)
          setPending(false)
          return
        }
      }
      if (feeTokens.length > 0) {
        const feeContract = getBribeContract(web3, pool.gauge.fee)
        const params = [veTHE.id, feeTokens]
        console.log('feeTokens :>> ', feeTokens)
        setPending(true)
        try {
          await sendContract(dispatch, key, feeuuid, feeContract, 'getReward', params, account)
        } catch (err) {
          console.log('fees claim error :>> ', err)
          setPending(false)
          return
        }
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Claimed Bribes + Fees',
        }),
      )
      setPending(false)
    },
    [account, web3],
  )

  return { onClaimBribes: handleClaimBribes, pending }
}

const useClaimFees = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()

  const handleClaimFees = useCallback(
    async (pool) => {
      const key = uuidv4()
      const harvestuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Claim fees for ${pool.symbol}`,
          transactions: {
            [harvestuuid]: {
              desc: `Claim fees`,
              status: TransactionType.START,
              hash: null,
            },
          },
        }),
      )
      const pairContract = getPairContract(web3, pool.address)
      const params = []
      setPending(true)
      try {
        await sendContract(dispatch, key, harvestuuid, pairContract, 'claimFees', params, account)
      } catch (err) {
        console.log('fees claim error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Claimed Fees',
        }),
      )
      setPending(false)
    },
    [account, web3],
  )

  return { onClaimFees: handleClaimFees, pending }
}

const useClaimRebase = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const veDist = useVeDist()

  const handleClaimRebase = useCallback(
    async (veTHE) => {
      const key = uuidv4()
      const veClaimuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Claim rebase for veTHE #${veTHE.id}`,
          transactions: {
            [veClaimuuid]: {
              desc: `Claim rebase`,
              status: TransactionType.START,
              hash: null,
            },
          },
        }),
      )
      const params = [veTHE.id]
      setPending(true)
      try {
        await sendContract(dispatch, key, veClaimuuid, veDist, 'claim', params, account)
      } catch (err) {
        console.log('rebase claim error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Claimed rebase',
        }),
      )
      setPending(false)
    },
    [account, veDist],
  )

  return { onClaimRebase: handleClaimRebase, pending }
}

const useClaimAll = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const web3 = useWeb3()
  const veDistContract = useVeDist()
  const voterContract = useVoter()

  const handleClaimAll = useCallback(
    async (veRewards, veTHE) => {
      const key = uuidv4()
      const bribesuuid = uuidv4()
      const feeuuid = uuidv4()
      const veuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Claim All Rewards for veTHE #${veTHE.id}`,
          transactions: {
            [bribesuuid]: {
              desc: `Claim bribes`,
              status: TransactionType.START,
              hash: null,
            },
            [feeuuid]: {
              desc: `Claim fees`,
              status: TransactionType.START,
              hash: null,
            },
            [veuuid]: {
              desc: `Claim rebase`,
              status: TransactionType.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      // claim bribes
      const bribeRewards = veRewards.filter((item) => item.isBribeExist)
      if (bribeRewards.length > 0) {
        const bribes = bribeRewards.map((item) => item.gauge.bribe)
        const bribeTokens = bribeRewards.map((item) => {
          return item.rewards.map((token) => token.address)
        })
        const bribeParams = [bribes, bribeTokens, veTHE.id]
        try {
          await sendContract(dispatch, key, bribesuuid, voterContract, 'claimBribes', bribeParams, account)
        } catch (err) {
          console.log('bribes claim error :>> ', err)
          setPending(false)
          return
        }
      } else {
        dispatch(
          updateTransaction({
            key,
            uuid: bribesuuid,
            status: TransactionType.SUCCESS,
          }),
        )
      }

      // claim fees
      const feeRewards = veRewards.filter((item) => item.isFeeExist)
      if (feeRewards.length > 0) {
        const fees = feeRewards.map((item) => item.gauge.fee)
        const feeTokens = feeRewards.map((item) => {
          return item.rewards.map((token) => token.address)
        })
        const feeParams = [fees, feeTokens, veTHE.id]
        try {
          await sendContract(dispatch, key, feeuuid, voterContract, 'claimFees', feeParams, account)
        } catch (err) {
          console.log('fees claim error :>> ', err)
          setPending(false)
          return
        }
      } else {
        dispatch(
          updateTransaction({
            key,
            uuid: feeuuid,
            status: TransactionType.SUCCESS,
          }),
        )
      }

      // claim rebase
      if (veTHE.rebase_amount.gt(0)) {
        const params = [veTHE.id]
        try {
          await sendContract(dispatch, key, veuuid, veDistContract, 'claim', params, account)
        } catch (err) {
          console.log('rebase claim error :>> ', err)
          setPending(false)
          return
        }
      } else {
        dispatch(
          updateTransaction({
            key,
            uuid: veuuid,
            status: TransactionType.SUCCESS,
          }),
        )
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Claimed All Rewards',
        }),
      )
      setPending(false)
    },
    [account, web3],
  )

  return { onClaimAll: handleClaimAll, pending }
}

export { useGetVeRewards, useExpectedRewards, useGetFees, useClaimBribes, useClaimFees, useClaimRebase, useClaimAll }
