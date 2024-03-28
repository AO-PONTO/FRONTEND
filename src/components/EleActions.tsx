import React from 'react'

interface propsActions {
    label: string[],
    setAction: React.Dispatch<React.SetStateAction<string>>,
    action: string
}

const Actions = (props:propsActions) => {
  return (
    <div className='flex flex-wrap'>
        {props.label.map((ele) => (
            <button
                className={`px-1 py-1 my-1 mx-2 border-b-2  ${props.action === ele ? 'border-primary' : 'border-transparent'} transition-all duration hover:bg-blue-50`} 
                key={ele}
                onClick={() => props.setAction(ele)}
            >
                {ele}
            </button>
        ))}
    </div>
  )
}

export default Actions