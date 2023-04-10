import { useWeb3React } from '@web3-react/core'
import React, { useContext, useState } from 'react'
import { BaseAssetsConetext } from '../../../context/BaseAssetsConetext'
import { formatAmount } from '../../../utils/formatNumber'
import SearchTokenPopup from '../SearchTokenPopup'

const percentArray = [25, 50, 75, 100]

const TokenInput = ({ title, asset, setAsset, amount, selectedAssets, onInputChange = () => {}, setAmount, disabled = false }) => {
  const [tokenPopup, setTokenPopup] = useState(false)
  const baseAssets = useContext(BaseAssetsConetext)
  const { account } = useWeb3React()

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between'>
        <p className='text-dimGray text-sm md:text-base leading-10'>{title}</p>
        {account && (
          <div className={`flex items-center text-sm md:text-base space-x-3`}>
            {!disabled && (
              <div className='flex items-center space-x-2.5'>
                {percentArray.map((percent, index) => {
                  return (
                    <div
                      className={`flex items-center justify-center bg-white bg-opacity-[0.08] round-[3px] text-white text-[13px] md:text-base w-[40px] md:w-[56px] h-[22px] md:h-[28px] cursor-pointer`}
                      onClick={() => asset && setAmount(asset?.balance?.times(percent).div(100).toString(10) || 0)}
                      key={`percent-${index}`}
                    >
                      {percent}%
                    </div>
                  )
                })}
              </div>
            )}
            <p className='text-white'>Balance: {!asset ? '-' : formatAmount(asset.balance)}</p>
            {/* {!disabled && <p className='text-green text-sm md:text-base'>Max</p>} */}
          </div>
        )}
      </div>
      <div className='gradient-bg mt-1.5 md:mt-2.5 p-px w-full rounded-[3px]'>
        <div className='bg-body pr-3 rounded-[3px] flex items-center'>
          <input
            value={amount}
            onChange={(e) => {
              if (Number(e.target.value) < 0) {
                setAmount('')
              } else {
                onInputChange(e)
              }
            }}
            className={`bg-transparent !border-0 w-4/5 py-[8px] lg:py-[15px] pl-2.5 lg:pl-4 text-xl lg:text-2xl leading-10 placeholder-[#757384] text-white`}
            placeholder='0.00'
            type={'number'}
            disabled={disabled}
            min={0}
          />
          {asset && (
            <div
              onClick={() => {
                setTokenPopup(true)
              }}
              className='flex items-center ml-2 space-x-5 f-f-fg lg:space-x-8 cursor-pointer'
            >
              <div className='flex items-center space-x-[3.5px] lg:space-x-2 '>
                <img className='w-[28px] h-[28px]' alt='' src={asset.logoURI} />
                <p className='font-medium text-sm lg:text-[1.2rem] leading-6 text-white'>{asset.symbol}</p>
              </div>
              <img style={{}} alt='' src='/images/swap/dropdown-arrow.png' />
            </div>
          )}
        </div>
      </div>
      <SearchTokenPopup popup={tokenPopup} setPopup={setTokenPopup} selectedAssets={selectedAssets} setSelectedAsset={setAsset} baseAssets={baseAssets} />
    </div>
  )
}

export default TokenInput
