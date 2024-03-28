import React from 'react'

interface propsButton {
    children: React.ReactNode,
    onClick?: React.MouseEventHandler<HTMLButtonElement>
}

const Button = (props:propsButton) => {
  return (
    <div className='w-full px-2'>
      <button 
          className='w-full p-2.5 transition duration bg-button hover:bg-buttonHover rounded-md shadow-lg my-2 uppercase text-white text-xs font-semibold'
          onClick={props.onClick}
      >
          {props.children}
      </button>
    </div>
  )
}

export default Button