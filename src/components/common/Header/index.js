import React, { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import ConnectWallet from '../../connectWallet'
import useAuth from '../../../hooks/useAuth'
import './style.scss'
import OutsideClickHandler from 'react-outside-click-handler'
import { connectors } from '../../../config/constants'
import { useSelector } from 'react-redux'
import useWalletModal from '../../../hooks/useWalletModal'
import usePrices from '../../../hooks/usePrices'
import { formatAmount } from '../../../utils/formatNumber'

const links = [
  {
    name: 'REWARDS',
    link: '/rewards',
  },
  {
    name: 'REFERRAL',
    link: '/referral',
  },
]

const Header = () => {
  const route = useLocation()
  const [connector, setConnector] = useState(null)
  const [secondDrop, setSecondDrop] = useState(false)
  const { account } = useWeb3React()
  const { logout } = useAuth()
  const [scroll, setScroll] = useState(false)
  const [selected, setSelected] = useState(false)
  const prices = usePrices()

  useEffect(() => {
    if (prices && prices['THE']) {
      document.title = `Thena - $${formatAmount(prices['THE'])}`
    }
  }, [prices])
  useEffect(() => {
    window.addEventListener('scroll', () => {
      setScroll(window.scrollY > 30)
    })
  }, [])
  const { isWalletOpen } = useSelector((state) => state.wallet)
  const { openWalletModal, closeWalletModal } = useWalletModal()

  useEffect(() => {
    closeWalletModal()
  }, [route.pathname])

  useEffect(() => {
    console.log('account :>> ', account)
    console.log('connector :>> ', connector)
    console.log('selected :>> ', selected)

    if (account) {
      if (!connector && !selected) {
        setConnector(connectors[0])
        setSelected(false)
      }
    } else {
      setConnector(null)
    }
  }, [account, connector, selected, setSelected])

  const dropDownhandler = () => {
    if (connector) {
      setSecondDrop(!secondDrop)
    } else {
      openWalletModal()
    }
  }

  const onDisconnect = () => {
    logout()
    setConnector(null)
    setSecondDrop(false)
  }

  return (
    <>
      {isWalletOpen && <ConnectWallet setConnector={setConnector} setSelected={setSelected} />}
      <div className={`header-wrap ${scroll ? 'bg-[#090333]' : 'bg-transparent'} transition-all duration-300 ease-in-out  fixed w-full z-[120]`}>
        <div className='header px-4 2xl:px-12 py-6'>
          <ul className='navigation absolute z-20 justify-center hidden xl:flex items-center w-full'>
            {links.map((item, idx) => {
              return (
                <li key={`main-${idx}`} className={`links`}>
                  <Link className={route.pathname.includes(item.link) ? 'text-sky' : 'font-light '} to={item.link}>
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
          <OutsideClickHandler
            onOutsideClick={() => {
              setSecondDrop(false)
            }}
          >
            <div
              onClick={() => {
                dropDownhandler()
              }}
              className={`${
                connector ? 'px-2.5 tracking-[1.12px] max-w-[209px] w-full' : 'px-3.5 text-xs tracking-[2px] xl:px-[25px] xl:tracking-[2px]'
              } bg-[#bd00ed1a] h-[46.85px] items-center font-semibold text-white  text-sm md:text-sm relative z-20  xl:text-base leading-7  connect-wallet f-f-fg hidden xl:flex`}
            >
              {connector ? (
                <div className='flex items-center space-x-4  xl:space-x-5'>
                  <div className='flex items-center flex-shrink-0 space-x-2'>
                    <img src={connector.title == 'MetaMask' ? '/images/header/metamask.svg' : connector.logo} className='max-w-[24px] h-6 ' alt='' />
                    <p className=''>{account ? `${account.slice(0, 6)}...${account.slice(-4)}` : ''}</p>
                  </div>
                  <button className={`${secondDrop ? ' rotate-180' : ' rotate-0'} transition-all duration-300 ease-in-out transform w-full`}>
                    <img className='w-4 h-4 flex-shrink-0 xl:w-auto xl:h-auto' src='/images/header/chevron.svg' alt='' />
                  </button>
                </div>
              ) : (
                'CONNECT WALLET'
              )}
            </div>

            {secondDrop && (
              <div className='absolute max-w-[209px] w-full py-[15px] px-5 border-blue border hover:border-[#0000FF] bg-body rounded-[3px] top-[60px] mt-5 hidden xl:block z-[101]'>
                <button onClick={onDisconnect} className='flex items-center space-x-[5.73px]'>
                  <img className='max-w-[24px] h-6' alt='' src='/images/header/logout-icon.svg' />
                  <p className='flex-shrink-0 text-[15px] text-white'>Logout</p>
                </button>
              </div>
            )}
          </OutsideClickHandler>
        </div>
      </div>
    </>
  )
}

export default Header
