import React, {useState} from 'react'
import ReactTooltip from 'react-tooltip'

const Index = ({className, arr}) => {
  const [arrow, setArrow] = useState(false)
  return (
    <div
      className={`${className} bg-white lg:flex items-center bg-opacity-[0.05] rounded-[3px] bg-clip-padding px-5 py-4`}>
      {arr.map((item, idx) => {
        return (
          <div
            key={idx}
            className={`border-b w-full lg:border-b-0 lg:border-r text-white  ${
              idx === arr.length - 1 ? 'border-transparent' : 'border-[#757384] pb-3 lg:pb-0 pr-[19px]'
            } ${idx > 0 && 'pt-3 lg:pt-0 lg:pl-5 '} `}
          >
            <p className='f-f-fg text-sm'>{item.title}</p>
            <div
              onMouseEnter={() => {
              }}
              onMouseLeave={() => {
              }}
              data-tip={item.toolTip}
              data-for={`custom-tooltip`}
              className={` ${item.toolTip ? 'cursor-pointer max-w-[200px]' : ''} flex items-center space-x-1`}
            >
              <p className='text-[#E9E9F2] font-medium text-lg lg:text-[22px] leading-8'>{item.balance}</p>
              {item.toolTip ? (
                <>
                  <img
                    alt=''
                    className={`${arrow ? 'rotate-180' : 'rotate-0'} transition-all duration-300 ease-in-out`}
                    src='/images/liquidity/small-arrow-bottom.svg'
                  />
                  <ReactTooltip
                    className='max-w-[180px] !bg-[#090333] !border !border-blue !text-[#E6E6E6] !text-base !py-[9px] !px-6 !opacity-100 after:!bg-body '
                    id={`custom-tooltip`}
                    place='top'
                    effect='solid'
                  >
                    <p>{item.toolTip}</p>
                  </ReactTooltip>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Index
