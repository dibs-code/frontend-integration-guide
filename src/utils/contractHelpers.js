import web3NoAccount from './web3'
import {
  getDibsAddress,
  getDibsLotteryAddress,
  getFactoryAddress,
  getMinterAddress,
  getMultiCallAddress,
  getMuonAddress,
  getPairAPIAddress,
  getRewardsAPIAddress,
  getRouterAddress,
  getRoyaltyAddress,
  getStakingAddress,
  getThenianAddress,
  getVeDistAddress,
  getVeTHEAddress,
  getVeTHEAPIAddress,
  getVoterAddress,
  getWBNBAddress,
} from './addressHelpers'
import {
  ERC20Abi,
  factoryAbi,
  gaugeAbi,
  multiCallAbi,
  pairAPIAbi,
  routerAbi,
  ThenianAbi,
  veDistAbi,
  veTHEAbi,
  veTHEAPIAbi,
  voterAbi,
  bribeAbi,
  minterAbi,
  pairAbi,
  stakingAbi,
  royaltyAbi,
  rewardAPIAbi,
  dibsAbi,
  muonAbi,
  wbnbAbi,
  dibsLotteryAbi,
} from '../config/abi'

const getContract = (abi, address, web3) => {
  const _web3 = web3 ?? web3NoAccount
  return new _web3.eth.Contract(abi, address)
}

export const getERC20Contract = (web3, address) => {
  return getContract(ERC20Abi, address, web3)
}

export const getWBNBContract = (web3) => {
  return getContract(wbnbAbi, getWBNBAddress(), web3)
}

export const getMulticallContract = (web3) => {
  return getContract(multiCallAbi, getMultiCallAddress(), web3)
}

export const getThenianContract = (web3) => {
  return getContract(ThenianAbi, getThenianAddress(), web3)
}

export const getRouterContract = (web3) => {
  return getContract(routerAbi, getRouterAddress(), web3)
}

export const getFactoryContract = (web3) => {
  return getContract(factoryAbi, getFactoryAddress(), web3)
}

export const getVeTHEContract = (web3) => {
  return getContract(veTHEAbi, getVeTHEAddress(), web3)
}

export const getVeDistContract = (web3) => {
  return getContract(veDistAbi, getVeDistAddress(), web3)
}

export const getVoterContract = (web3) => {
  return getContract(voterAbi, getVoterAddress(), web3)
}

export const getMinterContract = (web3) => {
  return getContract(minterAbi, getMinterAddress(), web3)
}

export const getPairAPIContract = (web3) => {
  return getContract(pairAPIAbi, getPairAPIAddress(), web3)
}

export const getVeTHEAPIContract = (web3) => {
  return getContract(veTHEAPIAbi, getVeTHEAPIAddress(), web3)
}

export const getRewardsAPIContract = (web3) => {
  return getContract(rewardAPIAbi, getRewardsAPIAddress(), web3)
}

export const getGaugeContract = (web3, address) => {
  return getContract(gaugeAbi, address, web3)
}

export const getBribeContract = (web3, address) => {
  return getContract(bribeAbi, address, web3)
}

export const getPairContract = (web3, address) => {
  return getContract(pairAbi, address, web3)
}

export const getStakingContract = (web3) => {
  return getContract(stakingAbi, getStakingAddress(), web3)
}

export const getRoyaltyContract = (web3) => {
  return getContract(royaltyAbi, getRoyaltyAddress(), web3)
}

export const getDibsContract = (web3) => {
  return getContract(dibsAbi, getDibsAddress(), web3)
}

export const getDibsLotteryContract = (web3) => {
  return getContract(dibsLotteryAbi, getDibsLotteryAddress(), web3)
}

export const getMuonContract = (web3) => {
  return getContract(muonAbi, getMuonAddress(), web3)
}
