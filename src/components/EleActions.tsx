import React from 'react'

// Interface para as props do componente Actions
interface propsActions {
    label: string[], // Array de rótulos dos botões de ação
    setAction: React.Dispatch<React.SetStateAction<string>>, // Função para definir a ação selecionada
    action: string // Ação atualmente selecionada
}

// Componente funcional 'Actions'
const Actions = (props: propsActions) => {
  return (
    // Div que engloba os botões de ação
    <div className='flex flex-wrap'>
        {/* Mapeia os rótulos dos botões de ação e renderiza cada botão */}
        {props.label.map((ele) => (
            <button
                // Estilos condicionais para os botões com base na ação selecionada
                className={`px-1 py-1 my-1 mx-2 border-b-2  ${props.action === ele ? 'border-primary' : 'border-transparent'} transition-all duration hover:bg-blue-50`} 
                key={ele} // Chave única para cada botão
                onClick={() => props.setAction(ele)} // Define a ação selecionada ao clicar no botão
            >
                {ele} {/* Rótulo do botão */}
            </button>
        ))}
    </div>
  )
}

export default Actions // Exporta o componente Actions como padrão para ser utilizado em outros arquivos
