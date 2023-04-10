import { Interface } from '@ethersproject/abi'
import { getMulticallContract } from './contractHelpers'

export const multicall = async (abi, calls) => {
  const multi = getMulticallContract()
  const itf = new Interface(abi)

  const calldata = calls.map((call) => ({
    target: call.address.toLowerCase(),
    callData: itf.encodeFunctionData(call.name, call.params),
  }))
  const { returnData } = await multi.methods.aggregate(calldata).call()

  const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call))

  return res
}
