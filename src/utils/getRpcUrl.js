import random from 'lodash/random'

// Array of available nodes to connect to
export const MainNodes = ['https://bsc-dataseed.binance.org/', 'https://rpc.ankr.com/bsc/', 'https://bscrpc.com/']
export const TestNodes = [
  'https://data-seed-prebsc-1-s1.binance.org:8545/',
  'https://data-seed-prebsc-1-s3.binance.org:8545/',
  'https://data-seed-prebsc-2-s3.binance.org:8545/',
]

const getRpcUrl = () => {
  const randomIndex = random(0, MainNodes.length - 1)
  return Number(process.env.REACT_APP_CHAIN_ID) === 97 ? TestNodes[randomIndex] : MainNodes[randomIndex]
}

export default getRpcUrl
