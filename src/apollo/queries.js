import gql from 'graphql-tag'

export const TOTAL_VOLUME_DATA = (block) => {
  const queryString = `query factories {
        factories(
         ${block ? `block: { number: ${block}}` : `first: 1`}) {
          totalVolumeUSD
        }
      }`
  return gql(queryString)
}

export const ACCUMULATIVE_TOKEN_BALANCES = (user) => {
  const queryString = `query accumulativeTokenBalances {
    accumulativeTokenBalances(where: {user: "${user}"}) {
      id
      user
      token
      amount
    }
  }`
  return gql(queryString)
}

export const USER_TICKETS = (user, round) => {
  const queryString = `query UserLotteriesQuery {
    userLotteries(where: {user: "${user}", round: ${round}}) {
      id
      user
      round
      tickets
    }
  }`
  return gql(queryString)
}

export const TOTAL_TICKETS = (round) => {
  const queryString = `query TotalTicketsQuery {
    lotteries(where: {round: ${round}}) {
      id
      totalTikets
    }
  }`
  return gql(queryString)
}

export const LeaderboardData = (begin, end, skip) => {
  const queryString = `query LeaderboardDataQuery {
    accumulativeGeneratedVolumes(first: 100, skip: ${skip}, where: {amountAsReferrer_gt: 0, lastUpdate_gte: ${begin}, lastUpdate_lt: ${end}} orderBy: lastUpdate, orderDirection: desc) {
      user
      amountAsReferrer
    }
  }`
  return gql(queryString)
}

export const WeeklyData = (epoch, skip) => {
  const queryString = `query WeeklyDataQuery {
    weeklyGeneratedVolumes(first: 100, skip: ${skip},  where: {epoch: ${epoch}, amountAsReferrer_gt: 0} orderBy: amountAsReferrer orderDirection: desc) {
      user
      amountAsReferrer
    }
  }`
  return gql(queryString)
}

export const DailyData = (day, skip) => {
  const queryString = `query DailyDataQuery {
    dailyGeneratedVolumes(first: 100, skip: ${skip},  where: {day: ${day}, amountAsReferrer_gt: 0} orderBy: amountAsReferrer orderDirection: desc) {
      user
      amountAsReferrer
    }
  }`
  return gql(queryString)
}
