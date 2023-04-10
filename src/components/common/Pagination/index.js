import React, { useState } from 'react'
import ReactPaginate from 'react-paginate'
import styled from 'styled-components'
import OutsideClickHandler from 'react-outside-click-handler'
import { NumberOfRows } from '../../../config/constants'

const MyPaginate = styled(ReactPaginate).attrs({
  // You can redefine classes here, if you want.
  activeClassName: 'active', // default to "selected"
})`
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style-type: none;
  color: #fff;
  font-size: 17px;
  li a {
    padding: 5px 11px;
    cursor: pointer;
    width: 30px;
    height: 30px;
  }
  li.active a {
    background: #0000af;
    border-radius: 3px;
  }
  li.disabled a {
    color: grey;
  }
  li.disable,
  li.disabled a {
    cursor: default;
  }
`

const Pagination = ({ pageSize, setPageSize, handlePageClick, pageCount, currentPage, total = 0 }) => {
  const [rowDropDown, setRowDropDown] = useState(false)
  return (
    <div className='flex flex-col-reverse items-center lg:flex-row w-full justify-end mt-[15px]'>
      <div className='flex space-x-5 lg:space-x-2 mt-3 lg:mt-0'>
        <div className='flex items-center space-x-2.5 text-[17px] text-white'>
          <p>Show: </p>{' '}
          <div className='relative z-20'>
            <div
              onClick={() => {
                setRowDropDown(!rowDropDown)
              }}
              className='flex items-center space-x-1 cursor-pointer'
            >
              <p>{pageSize} Rows</p>
              <img
                className={`${rowDropDown ? 'rotate-180' : ''} transform transition-all duration-300 ease-in-out`}
                alt=''
                src='/images/liquidity/small-arrow-bottom.svg'
              />
            </div>
            {rowDropDown && (
              <OutsideClickHandler
                onOutsideClick={() => {
                  setRowDropDown(false)
                }}
              >
                <div className='bg-[#000045] overflow-auto text-white border-[#0000AF] border text-xs md:text-base leading-6 rounded-md pl-3 py-2.5 pr-6 absolute top-8'>
                  {NumberOfRows.map((item, idx) => {
                    return (
                      <div
                        onClick={() => {
                          setPageSize(item)
                          setRowDropDown(false)
                        }}
                        className='flex items-center space-x-1 cursor-pointer'
                        key={idx * Math.random()}
                      >
                        <span>{item}</span> <p>Rows</p>
                      </div>
                    )
                  })}
                </div>
              </OutsideClickHandler>
            )}
          </div>
        </div>
        <div className='flex items-center space-x-2.5 text-[17px] text-white'>
          {`${currentPage * pageSize + 1}-${Math.min(currentPage * pageSize + pageSize, total)} of ${total}`}
        </div>
      </div>
      <MyPaginate
        breakLabel='...'
        nextLabel='>'
        onPageChange={handlePageClick}
        pageRangeDisplayed={1}
        pageCount={pageCount}
        previousLabel='<'
        renderOnZeroPageCount={null}
        forcePage={currentPage}
      />
    </div>
  )
}

export default Pagination
