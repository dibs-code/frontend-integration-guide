import React, { useContext, useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import StyledButton from '../../components/common/Buttons/styledButton'
import VeTHESelect from '../../components/common/VeTHESelect'
import Table from '../../components/pages/rewards'
import { veTHEsContext } from '../../context/veTHEsConetext'
import { useClaimAll, useExpectedRewards, useGetFees, useGetVeRewards } from '../../hooks/useRewards'
import { formatAmount } from '../../utils/formatNumber'
import usePrices from '../../hooks/usePrices'
import TabFilter from '../../components/common/TabFilter'
import ExpectedTable from '../../components/pages/rewards/expectedTable'

const claim = true

const rewardsTypes = ['Current Epoch', 'Next Epoch']

const Index = () => {
  const [veTHE, setVeTHE] = useState(null)
  const veTHEs = useContext(veTHEsContext)
  const veRewards = useGetVeRewards(veTHE)
  const expectedRewards = useExpectedRewards(veTHE)
  const fees = useGetFees()
  const prices = usePrices()
  const { onClaimAll, pending } = useClaimAll()
  const [filter, setFilter] = useState(rewardsTypes[0])

  const rewards = useMemo(() => {
    return veTHE && veTHE.rebase_amount.gt(0) ? [...veRewards, ...fees, veTHE] : [...veRewards, ...fees]
  }, [veTHE, fees, veRewards])

  useEffect(() => {
    if (veTHE) {
      setVeTHE(veTHEs.find((item) => item.id === veTHE.id))
    }
  }, [veTHEs, veTHE])

  const totalUsd = useMemo(() => {
    let total = [...veRewards, ...fees].reduce((sum, current) => {
      return sum.plus(current.totalUsd)
    }, new BigNumber(0))
    if (veTHE) {
      total = total.plus(veTHE.rebase_amount.times(prices['THE']))
    }
    return total
  }, [veRewards, fees, veTHE, prices])

  const totalExpectedUsd = useMemo(() => {
    return expectedRewards.reduce((sum, current) => {
      return sum.plus(current.totalUsd)
    }, new BigNumber(0))
  }, [expectedRewards])

  return (
    <>
      <div className='max-w-[1200px] px-5 sm:px-16 md:px-28 mdLg:px-40  lg:px-5 xl:px-0 pt-20  md:pt-[120px] mx-auto'>
        <div className='lg:flex items-end justify-between lg:space-x-[60px]'>
          <div className='w-full lg:w-1/2'>
            <div className='max-w-[450px]'>
              <h1 className='text-[34px] md:text-[42px] font-semibold text-white  f-f-fg'>Rewards</h1>
              <p className='text-[#b8b6cb] text-base md:text-lg leading-[22px] md:leading-6 mt-1 pr-10 md:pr-0'>Choose your veTHE and claim your rewards.</p>
            </div>
          </div>
        </div>
        <div className='md:flex items-center justify-between w-full mt-3 md:mt-1.5 md:space-x-5 lg:space-x-[60px] relative '>
          {/* for desktop */}
          <VeTHESelect className={'lg:w-[320px] w-full'} isSelected={veTHE} setIsSelected={setVeTHE} />
          <div className='lg:max-w-[600px] xl:max-w-[680px] gradient-bg w-full p-px rounded-[5px] mt-3 lg:mt-0'>
            <div className='solid-bg rounded-[5px] lg:flex items-center justify-between w-full h-auto lg:h-[76px] lg:space-x-10 py-3.5 px-3 lg:py-[17px] lg:px-5'>
              {claim ? (
                <div className='flex items-center justify-between md:justify-start space-x-1 xl:space-x-3'>
                  <p className='text-[16px] lg:text-[22px] text-white f-f-fg font-light'>Total Claimable Rewards:</p>
                  <p className='text-[22px] lg:text-[27px] font-medium text-white'>${formatAmount(filter === rewardsTypes[0] ? totalUsd : totalExpectedUsd)}</p>
                </div>
              ) : (
                <p className='text-[15px] lg:text-[22px] text-white f-f-fg'>
                  Rewards will be available on <span className='font-medium'>June 30, 2022.</span>
                </p>
              )}
              {filter === rewardsTypes[0] && (
                <StyledButton
                  disabled={totalUsd.isZero() || pending}
                  onClickHandler={() => {
                    onClaimAll(veRewards, veTHE)
                  }}
                  className={`text-white rounded-[3px] px-[35px] py-2 md:py-[9px] mt-3 lg:mt-0 w-full lg:w-auto`}
                  content={`Claim All`}
                />
              )}
            </div>
          </div>
        </div>
        <TabFilter data={rewardsTypes} filter={filter} setFilter={setFilter} className={'max-w-[440px] xl:max-w-[480px] mt-4 lg:mt-[23px]'} />
        {filter === rewardsTypes[0] ? <Table rewards={rewards} veTHE={veTHE} /> : <ExpectedTable rewards={expectedRewards} />}
      </div>
    </>
  )
}

export default Index
