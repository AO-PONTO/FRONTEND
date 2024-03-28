import React from 'react'

interface propsModal {
    open: boolean,
    confirm: React.MouseEventHandler<HTMLButtonElement>,
    exit: React.MouseEventHandler<HTMLButtonElement>,
    children: React.ReactNode
}

const Modal = (props:propsModal) => {
    if (props.open) {
        return (
            <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="w-[calc(100%-20px)] sm:w-1/2 md:w-1/3 lg:w-1/4 rounded-lg bg-white p-4">
                {props.children}
                <div className='flex'>
                    <div className='w-1/2 p-2'><button className='w-full p-2 transition duration bg-button hover:bg-buttonHover rounded' onClick={props.exit}>Fechar</button></div>
                    <div className='w-1/2 p-2'><button className='w-full p-2 transition duration bg-button hover:bg-buttonHover rounded' onClick={props.confirm}>Confirmar</button></div>
                </div>
            </div>
            </div>
        )
    }
}

export default Modal