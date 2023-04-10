import React, { useState, useMemo, useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import Pagination from '../../common/Pagination'
import TransparentButton from '../../common/Buttons/transparentButton'
import Sticky from 'react-stickynode'
import { NumberOfRows } from '../../../config/constants'
import { formatAmount } from '../../../utils/formatNumber'
import { useClaimBribes, useClaimFees, useClaimRebase } from '../../../hooks/useRewards'
import NoFound from '../../common/NoFound'
import usePrices from '../../../hooks/usePrices'
import { useWeb3React } from '@web3-react/core'

const sortEnabled = false

const sortOptions = [
  {
    label: 'Your Position',
    value: 'votes',
    isDesc: true,
  },
  {
    label: 'Reward',
    value: 'rewards',
    isDesc: true,
  },
]

const Index = ({ rewards, veTHE }) => {
  const [pageSize, setPageSize] = useState(NumberOfRows[0])
  const [currentPage, setCurrentPage] = useState(0)
  const [arrowReverse, setArrowReverse] = useState()
  const [sort, setSort] = useState(sortOptions[0])
  const { onClaimFees, pending: feePending } = useClaimFees()
  const { onClaimBribes, pending: bribePending } = useClaimBribes()
  const { onClaimRebase, pending: rebasePending } = useClaimRebase()
  const prices = usePrices()
  const { account } = useWeb3React()

  // const sortedRewards = useMemo(() => {
  //   return rewards.sort((a, b) => {
  //     let res
  //     switch (sort.value) {
  //       case sortOptions[0].value:
  //         res = a.votes.weight
  //           .minus(b.votes.weight)
  //           .times(sort.isDesc ? -1 : 1)
  //           .toNumber()
  //         break

  //       case sortOptions[1].value:
  //         res = a.totalUsd
  //           .minus(b.totalUsd)
  //           .times(sort.isDesc ? -1 : 1)
  //           .toNumber()
  //         break

  //       default:
  //         break
  //     }
  //     return res
  //   })
  // }, [rewards, sort])

  const pageCount = useMemo(() => {
    return Math.ceil(rewards.length / pageSize)
  }, [rewards, pageSize])

  const handlePageClick = (event) => {
    setCurrentPage(event.selected)
  }

  useEffect(() => {
    setCurrentPage(0)
  }, [pageSize])

  const tableData = useMemo(() => {
    return rewards.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
  }, [rewards, currentPage, pageSize])

  return (
    <>
      {/* for desktop */}
      {tableData.length > 0 ? (
        <div className='w-full mt-9'>
          <div className='w-full'>
            <Sticky
              enabled={true}
              innerActiveClass={'gradientBorder'}
              top={95}
              activeClass={''}
              innerClass={'px-6  lg:flex justify-between hidden z-[100] py-[0.475rem] lg:!-mb-[19px] xl:!mb-0 lg:!top-[-19px] xl:!top-[0]'}
              className={`z-[100]`}
            >
              <div className='w-[40%] font-medium text-[17px] xl:text-[18px] text-white f-f-fg'>Gauge</div>
              <div className='w-[25%] font-medium text-[17px] xl:text-[18px] text-white f-f-fg'>
                <div
                  onClick={() => {
                    if (sortEnabled) {
                      setSort({
                        ...sortOptions[0],
                        isDesc: sort.value === sortOptions[0].value ? !sort.isDesc : true,
                      })
                    }
                  }}
                  className='flex items-center cursor-pointer space-x-1 -ml-1 relative'
                >
                  {sort.value === sortOptions[0].value && (
                    <button className={`${sort.isDesc ? '' : 'rotate-180'} transform absolute -left-3.5`}>
                      <img alt='' src='/images/liquidity/arrow-bottom.svg' />
                    </button>
                  )}
                  <div className='flex items-center'>{sortOptions[0].label}</div>
                </div>
              </div>
              <div className='w-[15%] font-medium text-[17px] xl:text-[18px] text-white f-f-fg'>
                <div
                  onClick={() => {
                    if (sortEnabled) {
                      setSort({
                        ...sortOptions[1],
                        isDesc: sort.value === sortOptions[1].value ? !sort.isDesc : true,
                      })
                    }
                  }}
                  className='flex items-center cursor-pointer space-x-1 -ml-1 relative'
                >
                  {sort.value === sortOptions[1].value && (
                    <button className={`${sort.isDesc ? '' : 'rotate-180'} transform absolute -left-3.5`}>
                      <img alt='' src='/images/liquidity/arrow-bottom.svg' />
                    </button>
                  )}
                  <div className='flex items-center'>{sortOptions[1].label}</div>
                </div>
              </div>
              <div className='w-[20%] font-medium text-[17px] xl:text-[18px] text-white f-f-fg'></div>
            </Sticky>
            <div className='flex flex-col gradient-bg p-px rounded-[5px] shadow-box'>
              {tableData.map((pool, idx) => {
                if (pool && Number(pool.id) > 0) {
                  return (
                    <div
                      key={idx}
                      className={`${idx === 0 && 'rounded-t-[5px]'} ${
                        idx === tableData.length - 1 ? 'rounded-b-[5px]' : ''
                      } mb-px flex flex-wrap lg:flex-nowrap items-start lg:items-center w-full justify-between  text-[#DEDBF2] p-4 lg:py-5 lg:px-6 bg-[#16033A]`}
                    >
                      <div className='flex w-full lg:w-[40%] items-center space-x-3'>
                        <div className='flex items-center'>
                          <img className='relative z-10' alt='' src='/images/tokens/THE.png' width={30} height={30} />
                        </div>
                        <div className=''>
                          <p className='text-base xl:text-[19px] leading-[30px] font-medium'>veTHE</p>
                          <p className='tracking-[0.78px] text-[13px] leading-none'>Distribution</p>
                        </div>
                      </div>
                      <div className='flex flex-col mt-2 lg:mt-0 w-1/2 lg:w-[25%] items-start justify-center'>
                        <p className='lg:hidden text-sm f-f-fg font-medium'>Your Position</p>
                        <p className='text-base sm:text-[17px] lg:text-[15px] xl:text-[17px]'> {formatAmount(pool.voting_amount)} veTHE</p>
                      </div>
                      <div className='flex flex-col items-start mt-2 lg:mt-0 w-1/2 lg:w-[15%] justify-center'>
                        <p className='lg:hidden text-sm f-f-fg font-medium'>Reward</p>
                        <div
                          onMouseEnter={() => {
                            setArrowReverse(`tip4${idx}`)
                          }}
                          onMouseLeave={() => {
                            setArrowReverse(null)
                          }}
                          data-tip
                          data-for={`tip4${idx}`}
                          className='text-base flex items-center cursor-pointer space-x-1.5'
                        >
                          <p className='text-base sm:text-[17px] lg:text-[15px] xl:text-[17px]'>${formatAmount(pool.rebase_amount.times(prices['THE']))}</p>
                          <button className={`${arrowReverse === `tip4${idx}` ? 'rotate-180' : 'rotate-0'} transform transition-all duration-300 ease-in-out`}>
                            <img alt='' src='/images/liquidity/small-arrow-bottom.svg' />
                          </button>
                        </div>
                        <ReactTooltip
                          className='max-w-[180px] !bg-[#090333] !border !border-blue !text-[#E6E6E6] !text-base !py-[9px] !px-6 !opacity-100 after:!bg-body '
                          id={`tip4${idx}`}
                          place='right'
                          effect='solid'
                        >
                          <p>{formatAmount(pool.rebase_amount)} THE</p>
                        </ReactTooltip>
                      </div>
                      <div className='flex flex-col items-end w-full lg:w-[20%] mt-3.5 lg:mt-0 justify-center'>
                        <TransparentButton
                          disabled={rebasePending}
                          onClickHandler={() => {
                            onClaimRebase(veTHE)
                          }}
                          content={'Claim'}
                          className={'px-[33px] flex flex-col items-center w-full lg:w-auto py-[9px] justify-center text-white'}
                        />
                      </div>{' '}
                    </div>
                  )
                }
                return (
                  <div
                    key={idx}
                    className={`${idx === 0 && 'rounded-t-[5px]'} ${
                      idx === tableData.length - 1 ? 'rounded-b-[5px]' : ''
                    } mb-px flex flex-wrap lg:flex-nowrap items-start lg:items-center w-full justify-between  text-[#DEDBF2] p-4 lg:py-5 lg:px-6 bg-[#16033A]`}
                  >
                    <div className='flex  w-full  lg:w-[40%] items-center  space-x-3'>
                      <div className='flex items-center  -space-x-2'>
                        <img className='relative z-10' alt='' src={pool.token0.logoURI} width={30} height={30} />
                        <img className='relative z-[5]' alt='' src={pool.token1.logoURI} width={30} height={30} />
                      </div>
                      <div className=''>
                        <p className='text-base xl:text-[19px] leading-[30px] font-medium'>{pool.symbol}</p>
                        <p className='tracking-[0.78px] text-[13px] leading-none'>{pool.rewards ? 'Bribes + Fees' : 'Fees From Unstaked Position'}</p>
                      </div>
                    </div>
                    <div className='flex flex-col mt-2 lg:mt-0 w-1/2 lg:w-[25%] items-start justify-center'>
                      <p className='lg:hidden text-sm f-f-fg font-medium'>Your Position</p>
                      <div
                        onMouseEnter={() => {
                          setArrowReverse(`tip2${idx}`)
                        }}
                        onMouseLeave={() => {
                          setArrowReverse(null)
                        }}
                        data-tip
                        data-for={`tip2${idx}`}
                        className='text-base flex items-center cursor-pointer space-x-1.5'
                      >
                        <p className='text-base sm:text-[17px] lg:text-[15px] xl:text-[17px]'>${formatAmount(pool.account.totalUsd)}</p>
                        <button className={`${arrowReverse === `tip2${idx}` ? 'rotate-180' : 'rotate-0'} transform transition-all duration-300 ease-in-out`}>
                          <img alt='' src='/images/liquidity/small-arrow-bottom.svg' />
                        </button>
                      </div>
                      <ReactTooltip
                        className='max-w-[180px] !bg-[#090333] !border !border-blue !text-[#E6E6E6] !text-base !py-[9px] !px-6 !opacity-100 after:!bg-body '
                        id={`tip2${idx}`}
                        place='right'
                        effect='solid'
                      >
                        {formatAmount(pool.account.total0)} {pool.token0.symbol}
                        <br />
                        {formatAmount(pool.account.total1)} {pool.token1.symbol}
                      </ReactTooltip>
                    </div>
                    <div className='flex flex-col items-start mt-2 lg:mt-0 w-1/2 lg:w-[15%] justify-center'>
                      <p className='lg:hidden text-sm f-f-fg font-medium'>Reward</p>
                      <div
                        onMouseEnter={() => {
                          setArrowReverse(`tip4${idx}`)
                        }}
                        onMouseLeave={() => {
                          setArrowReverse(null)
                        }}
                        data-tip
                        data-for={`tip4${idx}`}
                        className='text-base flex items-center cursor-pointer space-x-1.5'
                      >
                        <p className='text-base sm:text-[17px] lg:text-[15px] xl:text-[17px]'>${formatAmount(pool.totalUsd)}</p>
                        <button className={`${arrowReverse === `tip4${idx}` ? 'rotate-180' : 'rotate-0'} transform transition-all duration-300 ease-in-out`}>
                          <img alt='' src='/images/liquidity/small-arrow-bottom.svg' />
                        </button>
                      </div>
                      <ReactTooltip
                        className='max-w-[180px] !bg-[#090333] !border !border-blue !text-[#E6E6E6] !text-base !py-[9px] !px-6 !opacity-100 after:!bg-body '
                        id={`tip4${idx}`}
                        place='right'
                        effect='solid'
                      >
                        {pool.rewards ? (
                          pool.rewards.map((reward, index) => {
                            return <p key={`reward-${index}`}>{`${formatAmount(reward.amount, false, 5)} ${reward.symbol}`}</p>
                          })
                        ) : (
                          <>
                            {formatAmount(pool.account.token0claimable)} {pool.token0.symbol}
                            <br />
                            {formatAmount(pool.account.token1claimable)} {pool.token1.symbol}
                          </>
                        )}
                      </ReactTooltip>
                    </div>
                    <div className='flex flex-col items-end w-full lg:w-[20%] mt-3.5 lg:mt-0 justify-center'>
                      <TransparentButton
                        disabled={feePending || bribePending}
                        onClickHandler={() => {
                          if (pool.rewards) {
                            onClaimBribes(pool, veTHE)
                          } else {
                            onClaimFees(pool)
                          }
                        }}
                        content={'Claim'}
                        className={'px-[33px] flex flex-col items-center w-full lg:w-auto py-[9px] justify-center text-white'}
                      />
                    </div>{' '}
                  </div>
                )
              })}
            </div>
          </div>
          <Pagination
            pageSize={pageSize}
            setPageSize={setPageSize}
            handlePageClick={handlePageClick}
            pageCount={pageCount}
            currentPage={currentPage}
            total={rewards.length}
          />
        </div>
      ) : (
        <div className='w-full mt-9'>
          <NoFound title={account ? 'No rewards found' : 'Please connect your wallet'} />
        </div>
      )}
    </>
  )
}

export default Index
