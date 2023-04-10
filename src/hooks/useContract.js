import { isAddress } from '@ethersproject/address'
import { useMemo } from 'react'
import {
  getDibsContract,
  getDibsLotteryContract,
  getERC20Contract,
  getFactoryContract,
  getMinterContract,
  getMuonContract,
  getPairAPIContract,
  getRewardsAPIContract,
  getRouterContract,
  getRoyaltyContract,
  getStakingContract,
  getThenianContract,
  getVeDistContract,
  getVeTHEAPIContract,
  getVeTHEContract,
  getVoterContract,
} from '../utils/contractHelpers'
import useWeb3 from './useWeb3'

export const useERC20 = (address) => {
  const web3 = useWeb3()
  return useMemo(() => {
    if (!isAddress(address)) return null
    return getERC20Contract(address, web3)
  }, [address, web3])
}

export const useThenian = () => {
  const web3 = useWeb3()
  return useMemo(() => getThenianContract(web3), [web3])
}

export const useRouter = () => {
  const web3 = useWeb3()
  return useMemo(() => getRouterContract(web3), [web3])
}

export const useFactory = () => {
  const web3 = useWeb3()
  return useMemo(() => getFactoryContract(web3), [web3])
}

export const useVeTHE = () => {
  const web3 = useWeb3()
  return useMemo(() => getVeTHEContract(web3), [web3])
}

export const useVeDist = () => {
  const web3 = useWeb3()
  return useMemo(() => getVeDistContract(web3), [web3])
}

export const useVoter = () => {
  const web3 = useWeb3()
  return useMemo(() => getVoterContract(web3), [web3])
}

export const useMinter = () => {
  const web3 = useWeb3()
  return useMemo(() => getMinterContract(web3), [web3])
}

export const usePairAPI = () => {
  const web3 = useWeb3()
  return useMemo(() => getPairAPIContract(web3), [web3])
}

export const useVeTHEAPI = () => {
  const web3 = useWeb3()
  return useMemo(() => getVeTHEAPIContract(web3), [web3])
}

export const useRewardsApi = () => {
  const web3 = useWeb3()
  return useMemo(() => getRewardsAPIContract(web3), [web3])
}

export const useStaking = () => {
  const web3 = useWeb3()
  return useMemo(() => getStakingContract(web3), [web3])
}

export const useRoyalty = () => {
  const web3 = useWeb3()
  return useMemo(() => getRoyaltyContract(web3), [web3])
}

export const useDibs = () => {
  const web3 = useWeb3()
  return useMemo(() => getDibsContract(web3), [web3])
}

export const useDibsLottery = () => {
  const web3 = useWeb3()
  return useMemo(() => getDibsLotteryContract(web3), [web3])
}

export const useMuon = () => {
  const web3 = useWeb3()
  return useMemo(() => getMuonContract(web3), [web3])
}
