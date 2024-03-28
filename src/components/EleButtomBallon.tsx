'use client'
import React from "react"

type propsButtomBallon = {
    direction: 'left-0' | 'right-0',
    children: React.ReactNode,
    icon: React.ComponentType<{ size: number; className: string; onClick: () => void }>,
    open: boolean,
    setOpen: Function
}

const ButtomBallon = (props: propsButtomBallon) => {
    return(
        <>
            <div 
                className={`absolute inset-0 w-screen h-screen bg-[#00000060] ${props.open ? 'block' : 'hidden'} z-50`}
                onClick={() => props.setOpen(false)}
            ></div>
            <div className='p-2 rounded-full duration-200 relative hover:bg-obscure z-50'>
                <props.icon size={20} className="text-white" onClick={() => props.setOpen(!props.open)} />
                <div className={`w-max ${props.direction} ${props.open ? 'h-max' : 'h-0'} overflow-hidden  absolute flex flex-col`}>
                    <div className="mt-1 h-2 -mb-3 mx-3.5 relative">
                        <div className={`h-2 w-2 rotate-45 bg-white absolute border-t border-l ${props.direction}`}>
                        </div>
                    </div>
                    <div className="bg-white text-black my-2 rounded-md p-3 border">
                        {props.children}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ButtomBallon