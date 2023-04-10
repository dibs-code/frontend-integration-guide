import BigNumber from 'bignumber.js'
import { TransactionType } from '../config/constants'
import { updateTransaction } from '../state/transactions/actions'
import { getWBNBAddress } from './addressHelpers'
import { customNotify } from './notify'

const backendApi = process.env.REACT_APP_BACKEND_API

const getBaseAssets = async () => {
  try {
    const response = await fetch(`${backendApi}/baseAssets`, {
      method: 'get',
    })
    const baseAssetsCall = await response.json()
    let baseAssets = baseAssetsCall.data

    const wbnbPrice = baseAssets.find((asset) => asset.address.toLowerCase() === getWBNBAddress().toLowerCase())?.price

    const nativeBNB = {
      address: 'BNB',
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
      logoURI: 'https://thena.fi/images/tokens/WBNB.png',
      price: wbnbPrice,
    }
    baseAssets.unshift(nativeBNB)
    return baseAssets.map((item) => {
      return {
        ...item,
        balance: new BigNumber(0),
      }
    })
  } catch (ex) {
    console.error('get baseAssets had error', ex)
    return null
  }
}

const getRouteAssets = async () => {
  // try {
  //   const response = await fetch(`${backendApi}/routeAssets`, {
  //     method: 'get',
  //   })
  //   const routeAssetsCall = await response.json()
  //   return routeAssetsCall.data
  // } catch (ex) {
  //   console.error('Route Assets fetched had error', ex)
  //   return []
  // }
}

const getPairs = async () => {
  try {
    const response = await fetch(`${backendApi}/pools`, {
      method: 'get',
    })
    const pairsCall = await response.json()

    return pairsCall
  } catch (ex) {
    console.error('Pairs fetched had error', ex)
    return []
  }
}

const getFloorPrice = async () => {
  try {
    const response = await fetch(`https://api.opensea.io/api/v1/collection/thenian/stats`, {
      method: 'get',
    })
    const res = await response.json()

    return res.stats
  } catch (ex) {
    console.error('opensea api fetch had error', ex)
    return []
  }
}

const sendContract = (dispatch, key, uuid, contract, method, params, account, msgValue = '0') => {
  let hash
  dispatch(
    updateTransaction({
      key,
      uuid,
      status: TransactionType.WAITING,
    }),
  )
  return new Promise((resolve, reject) => {
    contract.methods[method](...params)
      .send({
        from: account,
        value: msgValue,
      })
      .on('transactionHash', (tx) => {
        hash = tx
        dispatch(
          updateTransaction({
            key,
            uuid,
            status: TransactionType.PENDING,
            hash,
          }),
        )
      })
      .then((res) => {
        dispatch(
          updateTransaction({
            key,
            uuid,
            status: TransactionType.SUCCESS,
            hash,
          }),
        )
        customNotify('Transaction Successful!', 'success', hash)
        resolve(res)
      })
      .catch((err) => {
        dispatch(
          updateTransaction({
            key,
            uuid,
            status: TransactionType.FAILED,
            hash,
          }),
        )
        customNotify(err.message, 'error')
        reject(err)
      })
  })
}

const getAllowance = async (contract, target, account) => {
  try {
    return await contract.methods.allowance(account, target).call()
  } catch (ex) {
    console.error(ex)
    return 0
  }
}

export { getBaseAssets, getRouteAssets, getPairs, sendContract, getAllowance, getFloorPrice }
