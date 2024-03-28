import React, { MouseEventHandler, SetStateAction } from 'react'
import { EleButton, EstContainer } from '.'

interface propsModal {
    open: boolean,
    setAlert: MouseEventHandler<HTMLButtonElement>,
    message: string
}

const Modal = (props:propsModal) => {
    if (props.open) {
        return (
          <div className="absolute top-0 left-0 w-screen h-screen bg-[#00000077] flex justify-center items-center z-50">
          <EstContainer
            size="small"
            shadow="center"
            rounded="small"
            border="none"
          >
            <div className="flex w-full justify-center my-10 text-lg">
              {props.message}
            </div>
            <div className="flex w-full gap-2">
              <EleButton onClick={props.setAlert}>VOLTAR</EleButton>
            </div>
          </EstContainer>
        </div>
        )
    }
}

export default Modal