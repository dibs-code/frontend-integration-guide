import { getFactoryContract, getPairAPIContract } from './contractHelpers'
import { fromWei } from './formatNumber'

export const fetchUserPairs = async (web3, account) => {
  const factoryContract = getFactoryContract(web3)
  const pairLength = await factoryContract.methods.allPairsLength().call()

  const pairAPIContract = getPairAPIContract(web3)
  const pairInfos = await pairAPIContract.methods.getAllPair(account, pairLength, 0).call()

  return pairInfos.map((pair) => {
    return {
      address: pair[0], // pair contract address
      lpBalance: fromWei(pair[23], Number(pair[3])), // account LP tokens balance
      gaugeBalance: fromWei(pair[26], Number(pair[3])), // account pair staked in gauge balance
      gaugeEarned: fromWei(pair[27], Number(pair[22])), // account earned emissions for this pair
      totalLp: fromWei(pair[23], Number(pair[3])).plus(fromWei(pair[26], Number(pair[3]))), // account total LP tokens balance
      token0claimable: fromWei(pair[10], Number(pair[8])), // claimable 1st token from fees (for unstaked positions)
      token1claimable: fromWei(pair[15], Number(pair[13])), // claimable 2nd token from fees (for unstaked positions)
    }
  })
}
