import React from 'react'

// Interface para as props do componente Button
interface propsButton {
    children: React.ReactNode, // Conteúdo do botão
    onClick?: React.MouseEventHandler<HTMLButtonElement> // Evento de clique opcional
}

// Componente funcional 'Button'
const Button = (props: propsButton) => {
  return (
    // Div que engloba o botão
    <div className='w-full px-2'>
      {/* Botão */}
      <button 
          className='w-full p-2.5 transition duration bg-button hover:bg-buttonHover rounded-md shadow-lg my-2 uppercase text-white text-xs font-semibold'
          onClick={props.onClick} // Evento de clique definido pela propriedade onClick, se existir
      >
          {props.children} {/* Conteúdo do botão passado como children */}
      </button>
    </div>
  )
}

export default Button // Exporta o componente Button como padrão para ser utilizado em outros arquivos
