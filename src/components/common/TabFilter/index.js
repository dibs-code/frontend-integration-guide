import React from 'react'

const TabFilter = ({ data, filter, setFilter, className }) => {
  return (
    <div className={`flex items-center border-blue border w-full rounded-[10px] bg-[#0D1238]${className ? ' ' + className : ''}`}>
      {data.map((item, idx) => {
        return (
          <div
            onClick={() => setFilter(item)}
            key={`tab-${idx}`}
            className={`cursor-pointer ${
              data.length === 2 ? 'w-1/2' : 'w-1/3'
            } h-[34px] md:h-10 rounded-[10px] flex items-center justify-center uppercase transition-all ${
              filter === item ? 'bg-blue text-white font-medium' : 'text-dimGray'
            } 
            ${idx == data.length - 1 ? 'px-2' : ''} md:tracking-[0.6px] text-[13px] lg:text-sm xl:text-[15px] f-f-fg`}
          >
            {item}
          </div>
        )
      })}
    </div>
  )
}

export default TabFilter
