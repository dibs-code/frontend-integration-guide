import BigNumber from 'bignumber.js'
import { getVeTHEAPIContract } from './contractHelpers'
import { fromWei } from './formatNumber'

export const fetchUserVeTHEs = async (web3, account) => {
  const veTHEAPIContract = getVeTHEAPIContract(web3)
  const veTHEInfos = await veTHEAPIContract.methods.getNFTFromAddress(account).call()
  return veTHEInfos.map((veTHE) => {
    const lockedEnd = Number(veTHE[7])
    const diff = Math.ceil((lockedEnd - new Date().getTime() / 1000) / 86400)
    const totalVotes = veTHE[9].reduce((sum, current) => {
      return sum.plus(current[1])
    }, new BigNumber(0))

    const votedWeek = Math.floor(Number(veTHE[8]) / (86400 * 7))
    const currentWeek = Math.floor(new Date().getTime() / (86400 * 7 * 1000))
    const votedCurrentEpoch = votedWeek === currentWeek && veTHE[1]

    return {
      decimals: Number(veTHE[0]),
      voted: veTHE[1],
      votedCurrentEpoch,
      attachments: veTHE[2],
      id: veTHE[3],
      amount: fromWei(veTHE[4]),
      voting_amount: fromWei(veTHE[5]),
      rebase_amount: fromWei(veTHE[6]),
      lockEnd: lockedEnd,
      vote_ts: veTHE[8],
      votes: veTHE[9].map((item) => {
        return {
          address: item[0],
          weight: fromWei(item[1]),
          weightPercent: totalVotes.isZero() ? new BigNumber(0) : new BigNumber(item[1]).div(totalVotes).times(100),
        }
      }),
      diffDates: diff > 0 ? 'Expires in ' + diff + ' days' : 'Expired ' + diff * -1 + ' days ago',
    }
  })
}
