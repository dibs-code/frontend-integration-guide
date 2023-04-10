import React, { useState, useEffect, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import useAuth from '../../hooks/useAuth'
import { connectors } from '../../config/constants'
import useWalletModal from '../../hooks/useWalletModal'

const Index = ({ setConnector, setSelected }) => {
  const { login } = useAuth()
  const [activeConnector, setActiveConnector] = useState(null)
  const { closeWalletModal } = useWalletModal()
  const { account } = useWeb3React()

  useEffect(() => {
    if (account && activeConnector) {
      closeWalletModal()
      setConnector(activeConnector)
    }
  }, [account, activeConnector])

  const onConnect = useCallback(
    (type) => {
      login(type)
    },
    [login],
  )

  return (
    <>
      <div className='bg-body bg-opacity-[0.88] fixed z-[1000] inset-0 w-full h-full' />
      <div className='pt-[15px] pb-[20px] px-3 lg:px-5 max-w-[90%] lg:max-w-[544px] fixed w-full h-fit bg-body border inset-0 mx-auto top-[45px] lg:m-auto z-[1001] border-blue rounded-[3px]'>
        <div className='flex items-center justify-between'>
          <p className='text-lg lg:text-22 text-white leading-10 font-medium f-f-fg'>Connect Your Wallet</p>
          <button onClick={() => closeWalletModal()}>
            <img alt='' src='/images/common/close-button1.svg' />
          </button>
        </div>
        <div className='mt-[15px] lg:mt-[23px] grid lg:grid-cols-2 gap-2.5 lg:gap-3'>
          {connectors.map((item, idx) => {
            return (
              <div
                onClick={() => {
                  setSelected(true)
                  onConnect(item.connector)
                  setActiveConnector(item)
                }}
                key={idx}
                role={'button'}
                className='group h-[60px] lg:h-[76px] rounded-[3px] flex cursor-pointer items-center px-2.5 lg:pl-[30px] border-[#091491] hover:border-[#0000FF] border transition-all duration-300 ease-in-out'
              >
                <img
                  className='group-hover:shadow-[#0000FF] drop--xl w-10 h-10 lg:w-11 lg:h-11 transition-all duration-300 ease-in-out'
                  alt={idx}
                  src={item.logo}
                />
                <p className='ml-3 text-white f-f-fg text-[15px] lg:text-[17px] font-semibold leading-none'>{item.title}</p>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Index
