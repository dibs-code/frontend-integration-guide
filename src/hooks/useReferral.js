import { useCallback, useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useWeb3React } from '@web3-react/core'
import { keccak256 } from '@ethersproject/keccak256'
import { toUtf8Bytes } from '@ethersproject/strings'
import BigNumber from 'bignumber.js'
import { v4 as uuidv4 } from 'uuid'
import { fromWei, toWei, ZERO_ADDRESS } from '../utils/formatNumber'
import { useDibs, useDibsLottery, useMuon } from './useContract'
import useRefresh from './useRefresh'
import { customNotify } from '../utils/notify'
import { completeTransaction, openTransaction } from '../state/transactions/actions'
import { LotteryStatus, REACT_APP_MUON_API_URL, TransactionType } from '../config/constants'
import { sendContract } from '../utils/api'
import { dibsClient } from '../apollo/client'
import { ACCUMULATIVE_TOKEN_BALANCES, DailyData, TOTAL_TICKETS, USER_TICKETS, WeeklyData } from '../apollo/queries'
import { getDibsAddress } from '../utils/addressHelpers'
import { dibsAbi } from '../config/abi'
import { multicall } from '../utils/multicall'
import { BaseAssetsConetext } from '../context/BaseAssetsConetext'
import useGetMuonSignature from './useMuonSignature'
import Web3 from 'web3'
import { ethers } from 'ethers'

const getWeeklyLeaderboardData = async (epoch) => {
  let result = []
  let index = 0
  let leaderRes
  do {
    leaderRes = await dibsClient.query({
      query: WeeklyData(epoch, index),
      fetchPolicy: 'cache-first',
    })
    if (leaderRes.data.weeklyGeneratedVolumes.length > 0) {
      result = [...result, ...leaderRes.data.weeklyGeneratedVolumes]
    }
    index += leaderRes.data.weeklyGeneratedVolumes.length
  } while (leaderRes.data.weeklyGeneratedVolumes.length > 0)
  const sortedData = result
    .filter((ele) => ele.user !== getDibsAddress().toLowerCase())
    .map((ele) => {
      return {
        ...ele,
        volume: fromWei(ele.amountAsReferrer),
      }
    })
  const calls = sortedData.map((item) => {
    return {
      address: getDibsAddress(),
      name: 'getCodeName',
      params: [item.user],
    }
  })
  const rawCodeNames = await multicall(dibsAbi, calls)
  const final = sortedData.map((data, index) => {
    return {
      ...data,
      code: rawCodeNames[index][0],
    }
  })
  return final
}

const getDailyLeaderboardData = async (epoch) => {
  let result = []
  let index = 0
  let leaderRes
  do {
    leaderRes = await dibsClient.query({
      query: DailyData(epoch, index),
      fetchPolicy: 'cache-first',
    })
    if (leaderRes.data.dailyGeneratedVolumes.length > 0) {
      result = [...result, ...leaderRes.data.dailyGeneratedVolumes]
    }
    index += leaderRes.data.dailyGeneratedVolumes.length
  } while (leaderRes.data.dailyGeneratedVolumes.length > 0)
  const sortedData = result
    .filter((ele) => ele.user !== getDibsAddress().toLowerCase())
    .map((ele) => {
      return {
        ...ele,
        volume: fromWei(ele.amountAsReferrer),
      }
    })
  const calls = sortedData.map((item) => {
    return {
      address: getDibsAddress(),
      name: 'getCodeName',
      params: [item.user],
    }
  })
  const rawCodeNames = await multicall(dibsAbi, calls)
  const final = sortedData.map((data, index) => {
    return {
      ...data,
      code: rawCodeNames[index][0],
    }
  })
  return final
}

const useDibsCode = () => {
  const [codeName, setCodeName] = useState('')
  const [parentCodeName, setParentCodeName] = useState('')
  const [balancesToClaim, setBalancesToClaim] = useState([])
  const [claimedBalances, setClaimedBalances] = useState([])
  const [projectId, setProjectId] = useState('')
  const dibsContract = useDibs()
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const baseAssets = useContext(BaseAssetsConetext)

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const [res0, res1, res2, res3] = await Promise.all([
          dibsContract.methods.getCodeName(account).call(),
          dibsContract.methods.parents(account).call(),
          dibsClient.query({
            query: ACCUMULATIVE_TOKEN_BALANCES(account.toLowerCase()),
            fetchPolicy: 'cache-first',
          }),
          dibsContract.methods.PROJECT_ID().call(),
        ])
        setCodeName(res0)
        setProjectId(res3)
        if (!res1 || res1 === ZERO_ADDRESS) {
          setParentCodeName('')
        } else {
          const res = await dibsContract.methods.getCodeName(res1).call()
          setParentCodeName(res)
        }
        // accumulative tokens
        const userTokens = res2.data.accumulativeTokenBalances

        const calls = userTokens.map((item) => {
          return {
            address: getDibsAddress(),
            name: 'claimedBalance',
            params: [item.token, account],
          }
        })

        const rawTokenBalances = await multicall(dibsAbi, calls)
        const balances = userTokens.map((item, i) => {
          const token = baseAssets.find((asset) => asset.address.toLowerCase() === item.token.toLowerCase())
          return {
            ...token,
            balance: fromWei(item.amount, token.decimals),
            claimedBalance: fromWei(rawTokenBalances[i], token.decimals),
            balanceToClaim: fromWei(new BigNumber(item.amount).minus(rawTokenBalances[i]), token.decimals),
          }
        })
        setBalancesToClaim(balances.filter((bal) => !bal.balanceToClaim.isZero()))
        setClaimedBalances(balances.filter((bal) => !bal.claimedBalance.isZero()))
      } catch (error) {
        console.log('referral get error :>> ', error)
      }
    }
    if (account && baseAssets.length > 0) {
      fetchAccountInfo()
    } else {
      setCodeName('')
      setParentCodeName('')
      setBalancesToClaim([])
      setClaimedBalances([])
    }
  }, [dibsContract, account, baseAssets, fastRefresh])

  return { codeName, parentCodeName, balancesToClaim, claimedBalances, projectId }
}

const useRegister = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const dibsContract = useDibs()

  const handleRegister = useCallback(
    async (name, parentName) => {
      const yourCode = keccak256(toUtf8Bytes(name))
      const parentCode = keccak256(toUtf8Bytes(parentName))
      const [res0, res1] = await Promise.all([dibsContract.methods.codeToAddress(yourCode).call(), dibsContract.methods.codeToAddress(parentCode).call()])
      console.log({ res0, res1 })
      if (res0 !== ZERO_ADDRESS) {
        customNotify('Code already exists', 'warn')
        return
      }
      const key = uuidv4()
      const registeruuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Create your Dibs Code`,
          transactions: {
            [registeruuid]: {
              desc: `Create Code`,
              status: TransactionType.START,
              hash: null,
            },
          },
        }),
      )

      setPending(true)
      try {
        await sendContract(dispatch, key, registeruuid, dibsContract, 'register', [name, parentCode], account)
      } catch (err) {
        console.log('register error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Registered Successfully',
        }),
      )
      setPending(false)
    },
    [account, dibsContract],
  )

  return { onRegister: handleRegister, pending }
}

const useDibsLotteryData = () => {
  const [activeLotteryRound, setActiveLotteryRound] = useState(null)
  const [totalTickets, setTotalTickets] = useState(0)
  const [lastWinners, setLastWinners] = useState([])
  const dibsLotteryContract = useDibsLottery()
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res0 = await dibsLotteryContract.methods.getActiveLotteryRound().call()
        setActiveLotteryRound(Number(res0))
        const [lastwinnersRes, totalRes] = await Promise.all([
          dibsLotteryContract.methods.getRoundWinners(Number(res0) - 1).call(),
          dibsClient.query({
            query: TOTAL_TICKETS(Number(res0)),
            fetchPolicy: 'cache-first',
          }),
        ])
        if (totalRes.data.lotteries.length > 0) {
          setTotalTickets(Number(totalRes.data.lotteries[0].totalTikets))
        }
        if (lastwinnersRes.length > 0) {
          const calls = lastwinnersRes.map((item) => {
            return {
              address: getDibsAddress(),
              name: 'getCodeName',
              params: [item],
            }
          })
          const rawCodeNames = await multicall(dibsAbi, calls)
          setLastWinners(
            lastwinnersRes.map((item, index) => {
              return {
                address: item,
                code: rawCodeNames[index][0],
              }
            }),
          )
        }
      } catch (error) {
        console.log('referral get error :>> ', error)
      }
    }
    fetchInfo()
  }, [dibsLotteryContract, account, fastRefresh])

  return { activeLotteryRound, lastWinners, totalTickets }
}

const useDibsLotteryUserData = () => {
  const [userLotteryTickets, setUserLotteryTickets] = useState([])
  const [userLotteryStatus, setUserLotteryStatus] = useState(LotteryStatus.UNKNOWN)
  const [rewards, setRewards] = useState([])
  const [rewardsInUsd, setRewardsInUsd] = useState(new BigNumber(0))
  const { activeLotteryRound, lastWinners } = useDibsLotteryData()
  const dibsLotteryContract = useDibsLottery()
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const baseAssets = useContext(BaseAssetsConetext)

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const [ticketRes, rewardsRes] = await Promise.all([
          dibsClient.query({
            query: USER_TICKETS(account.toLowerCase(), Number(activeLotteryRound)),
            fetchPolicy: 'cache-first',
          }),
          dibsLotteryContract.methods.getUserTokensAndBalance(account).call(),
        ])
        setUserLotteryTickets(ticketRes.data.userLotteries)
        let temp = []
        rewardsRes[0].forEach((ele, index) => {
          const asset = baseAssets.find((item) => item.address.toLowerCase() === ele.toLowerCase())
          if (asset) {
            temp.push({
              ...asset,
              amount: fromWei(rewardsRes[1][index], asset.decimals),
            })
          }
        })
        const totalUsd = temp.reduce((sum, cur) => {
          return sum.plus(cur.amount.times(cur.price))
        }, new BigNumber(0))
        setRewards(temp)
        setRewardsInUsd(totalUsd)
        const found = lastWinners.find((item) => item.address.toLowerCase() === account.toLowerCase())
        if (found) {
          setUserLotteryStatus(LotteryStatus.WON)
        } else {
          setUserLotteryStatus(LotteryStatus.LOST)
        }
      } catch (error) {
        console.log('referral get error :>> ', error)
      }
    }
    if (account) {
      fetchInfo()
    } else {
      setUserLotteryTickets([])
      setUserLotteryStatus(LotteryStatus.UNKNOWN)
      setRewards([])
    }
  }, [dibsLotteryContract, activeLotteryRound, lastWinners, account, fastRefresh])

  return { userLotteryTickets, userLotteryStatus, baseAssets, rewards, rewardsInUsd }
}

const useLeaderboardData = () => {
  const [currentData, setCurrentData] = useState([])
  const [prevData, setPrevData] = useState([])
  const dibsContract = useDibs()
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const [isDaily, setIsDaily] = useState(false)

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const time = new Date().getTime() / 1000
        const startDailyTimestamp = 1677110400
        const firstTimestamp = 1673481600
        const currentWeeklyEpoch = Math.floor((time - firstTimestamp) / 604800)
        const currentDailyEpoch = Math.floor((time - startDailyTimestamp) / 86400) + 42
        setIsDaily(time > startDailyTimestamp)
        if (time > startDailyTimestamp + 86400) {
          const [cur, prev] = await Promise.all([getDailyLeaderboardData(currentDailyEpoch), getDailyLeaderboardData(currentDailyEpoch - 1)])
          setCurrentData(cur)
          setPrevData(prev)
        } else if (time > startDailyTimestamp) {
          const [cur, prev] = await Promise.all([getDailyLeaderboardData(currentDailyEpoch), getWeeklyLeaderboardData(currentWeeklyEpoch - 1)])
          setCurrentData(cur)
          setPrevData(prev)
        } else {
          const [cur, prev] = await Promise.all([getWeeklyLeaderboardData(currentWeeklyEpoch), getWeeklyLeaderboardData(currentWeeklyEpoch - 1)])
          setCurrentData(cur)
          setPrevData(prev)
        }
      } catch (error) {
        console.log('leaderboard get error :>> ', error)
      }
    }
    fetchInfo()
  }, [dibsContract, account, fastRefresh])

  return { currentData, prevData, isDaily }
}

const useClaimFees = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const muonContract = useMuon()
  const getMuonSignature = useGetMuonSignature()
  const { projectId } = useDibsCode()

  const handleClaimFees = useCallback(
    async (balanceToClaim) => {
      const timestamp = Math.floor(Date.now() / 1000)
      setPending(true)
      let sig
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        if (!provider) {
          customNotify('No provider found', 'error')
          setPending(false)
          return
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
          message: { user: account, timestamp },
        }
        sig = await signer._signTypedData(typedData.domain, typedData.types, typedData.message)
      } catch (error) {
        customNotify('User denied message signature.', 'error')
        setPending(false)
        return
      }
      let muonVerificationData
      try {
        const response = await fetch(
          `${REACT_APP_MUON_API_URL}v1/?app=dibsGlobal&method=claim&params[user]=${account}&params[projectId]=${projectId}&params[token]=${balanceToClaim.address}&params[time]=${timestamp}&params[sign]=${sig}`,
          {
            method: 'get',
          },
        )
        const res = await response.json()
        console.log({ res })
        if (res.success) {
          muonVerificationData = res.result
        } else {
          customNotify(res.error.message, 'error')
          setPending(false)
          return
        }
      } catch (error) {
        console.log('sig verify error :>> ', error)
        setPending(false)
        return
      }
      const params = [
        account,
        Web3.utils.toChecksumAddress(balanceToClaim.address),
        account,
        toWei(balanceToClaim.balance, balanceToClaim.decimals).toString(10),
        toWei(balanceToClaim.balanceToClaim, balanceToClaim.decimals).toString(10),
        muonVerificationData.reqId,
        {
          signature: muonVerificationData.signatures[0].signature,
          owner: muonVerificationData.signatures[0].owner,
          nonce: muonVerificationData.data.init.nonceAddress,
        },
        muonVerificationData.shieldSignature,
      ]
      const key = uuidv4()
      const claimuuid = uuidv4()
      dispatch(
        openTransaction({
          key,
          title: `Claim Fees`,
          transactions: {
            [claimuuid]: {
              desc: `Claim Fees`,
              status: TransactionType.START,
              hash: null,
            },
          },
        }),
      )

      try {
        await sendContract(dispatch, key, claimuuid, muonContract, 'claim', params, account)
      } catch (err) {
        console.log('claim error :>> ', err)
        setPending(false)
        return
      }

      dispatch(
        completeTransaction({
          key,
          final: 'Claimed Successfully',
        }),
      )
      setPending(false)
    },
    [account, projectId, muonContract, getMuonSignature],
  )

  return { onClaimFees: handleClaimFees, pending }
}

const useClaimPrize = () => {
  const [pending, setPending] = useState(false)
  const { account } = useWeb3React()
  const dispatch = useDispatch()
  const lotteryContract = useDibsLottery()

  const handleClaimPrize = useCallback(async () => {
    setPending(true)
    const key = uuidv4()
    const claimuuid = uuidv4()
    dispatch(
      openTransaction({
        key,
        title: `Claim Prize`,
        transactions: {
          [claimuuid]: {
            desc: `Claim Prize`,
            status: TransactionType.START,
            hash: null,
          },
        },
      }),
    )

    const params = [account]
    try {
      await sendContract(dispatch, key, claimuuid, lotteryContract, 'claimReward', params, account)
    } catch (err) {
      console.log('claim error :>> ', err)
      setPending(false)
      return
    }

    dispatch(
      completeTransaction({
        key,
        final: 'Claimed Successfully',
      }),
    )
    setPending(false)
  }, [account, lotteryContract])

  return { onClaimPrize: handleClaimPrize, pending }
}

export { useDibsCode, useRegister, useDibsLotteryData, useLeaderboardData, useDibsLotteryUserData, useClaimFees, useClaimPrize }
