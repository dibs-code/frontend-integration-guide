import React, { useState, useContext, useEffect } from 'react'
import { veTHEsContext } from '../../../context/veTHEsConetext'
import VeTHEPopup from '../VeTHEPopup'

const VeTHESelect = ({ className, isSelected, setIsSelected }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [init, setIsInit] = useState(false)
  const veTHEs = useContext(veTHEsContext)

  useEffect(() => {
    if (veTHEs.length > 0) {
      if (!init) {
        setIsInit(true)
        setIsSelected(veTHEs[0])
      }
    } else {
      setIsSelected(null)
    }
  }, [veTHEs, init])

  return (
    <div className={`dropdownwrapper${className ? ' ' + className : ''}`}>
      <div className={`w-full flex items-center h-[42px] md:h-[52px] border border-blue rounded-[3px] bg-[#000045] bg-opacity-80 px-4`}>
        <div className='text-white font-medium whitespace-nowrap pr-3 border-r border-blue f-f-fg'>SELECT veTHE:</div>
        <div
          className={`pl-3 w-full relative focus:outline-none py-2 bg-transparent rounded-[3px] text-white flex items-center justify-between cursor-pointer`}
          onClick={() => {
            if (veTHEs.length > 0) {
              setIsOpen(true)
            }
          }}
        >
          {isSelected ? <span className='text-white text-lg'>{`#${isSelected.id}`}</span> : <div className='text-dimGray text-lg'>Not found</div>}
          <img
            className={`${isOpen ? 'rotate-180' : 'rotate-0'} transform transition-all duration-300 ease-in-out`}
            alt=''
            src='/images/swap/dropdown-arrow.png'
          />
        </div>
      </div>
      <VeTHEPopup popup={isOpen} setPopup={setIsOpen} setSelectedVeTHE={setIsSelected} veTHEs={veTHEs} />
    </div>
  )
}

export default VeTHESelect
