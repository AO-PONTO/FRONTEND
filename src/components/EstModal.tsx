import React from 'react'

// Definição das propriedades do componente Modal
interface propsModal {
    open: boolean, // Indica se o modal está aberto ou fechado
    confirm: React.MouseEventHandler<HTMLButtonElement>, // Função de clique para confirmar a ação
    exit: React.MouseEventHandler<HTMLButtonElement>, // Função de clique para fechar o modal
    children: React.ReactNode // Conteúdo do modal
}

// Componente Modal que exibe conteúdo em um modal na tela
const Modal = (props: propsModal) => {
    // Verifica se o modal está aberto
    if (props.open) {
        return (
            // Div que cobre a tela inteira e exibe o modal centralizado
            <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 z-50">
                {/* Div que contém o conteúdo do modal */}
                <div className="w-[calc(100%-20px)] sm:w-1/2 md:w-1/3 lg:w-1/4 rounded-lg bg-white p-4">
                    {props.children} {/* Renderiza o conteúdo do modal */}
                    {/* Div que contém os botões de fechar e confirmar */}
                    <div className='flex'>
                        {/* Botão de fechar o modal */}
                        <div className='w-1/2 p-2'><button className='w-full p-2 transition duration bg-button hover:bg-buttonHover rounded' onClick={props.exit}>Fechar</button></div>
                        {/* Botão de confirmar a ação no modal */}
                        <div className='w-1/2 p-2'><button className='w-full p-2 transition duration bg-button hover:bg-buttonHover rounded' onClick={props.confirm}>Confirmar</button></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Modal // Exporta o componente Modal
