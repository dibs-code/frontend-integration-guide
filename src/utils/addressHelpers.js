import { defaultChainId } from '../config/constants'
import addresses from '../config/constants/contracts'

export const getAddress = (address) => {
  return address[defaultChainId]
}

export const getMultiCallAddress = () => {
  return getAddress(addresses.multiCall)
}

export const getTHEAddress = () => {
  return getAddress(addresses.THE)
}

export const getWBNBAddress = () => {
  return getAddress(addresses.WBNB)
}

export const getETHAddress = () => {
  return getAddress(addresses.ETH)
}

export const getThenianAddress = () => {
  return getAddress(addresses.thenian)
}

export const getRouterAddress = () => {
  return getAddress(addresses.router)
}

export const getFactoryAddress = () => {
  return getAddress(addresses.factory)
}

export const getVeTHEAddress = () => {
  return getAddress(addresses.veTHE)
}

export const getVeDistAddress = () => {
  return getAddress(addresses.veDist)
}

export const getVoterAddress = () => {
  return getAddress(addresses.voter)
}

export const getMinterAddress = () => {
  return getAddress(addresses.minter)
}

export const getPairAPIAddress = () => {
  return getAddress(addresses.pairAPI)
}

export const getRewardsAPIAddress = () => {
  return getAddress(addresses.rewardsAPI)
}

export const getVeTHEAPIAddress = () => {
  return getAddress(addresses.veTHEAPI)
}

export const getStakingAddress = () => {
  return getAddress(addresses.staking)
}

export const getRoyaltyAddress = () => {
  return getAddress(addresses.royalty)
}

export const getDibsAddress = () => {
  return getAddress(addresses.dibs)
}

export const getDibsLotteryAddress = () => {
  return getAddress(addresses.dibsLottery)
}

export const getMuonAddress = () => {
  return getAddress(addresses.muon)
}
