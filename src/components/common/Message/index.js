import React from 'react'

const Message = ({ closeToast, title, type = null, hash = null }) => (
  <div className='flex items-center justify-between'>
    <div className='flex items-center'>
      {type && <img className='message-icon' src={`/images/mark/${type}-mark.svg`}></img>}
      <div>
        <div className='message-title f-f-fg'>{title}</div>
        {hash && (
          <div
            className='text-green text-sm leading-6 cursor-pointer flex items-center underline underline-offset-2'
            onClick={() => {
              window.open(`https://bscscan.com/tx/${hash}`, '_blank')
            }}
          >
            View on BscScan
            <img src='/images/svgs/link.svg' className='ml-1 text-green' alt='link' />
          </div>
        )}
      </div>
    </div>
    <img src='/images/mark/close-button.svg' onClick={closeToast}></img>
  </div>
)

export default Message
