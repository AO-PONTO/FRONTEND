'use client'
import React from "react"

// Definição do tipo das props do componente ButtomBallon
type propsButtomBallon = {
    direction: 'left-0' | 'right-0', // Direção do balão (esquerda ou direita)
    children: React.ReactNode, // Conteúdo do balão
    icon: React.ComponentType<{ size: number; className: string; onClick: () => void }>, // Ícone que controla a abertura e o fechamento do balão
    open: boolean, // Estado que indica se o balão está aberto ou fechado
    setOpen: Function // Função para atualizar o estado do balão
}

// Componente funcional 'ButtomBallon'
const ButtomBallon = (props: propsButtomBallon) => {
    return(
        <>
            {/* Camada de fundo escura que cobre a tela quando o balão está aberto */}
            <div 
                className={`absolute inset-0 w-screen h-screen bg-[#00000060] ${props.open ? 'block' : 'hidden'} z-50`}
                onClick={() => props.setOpen(false)} // Fecha o balão ao clicar na camada de fundo escura
            ></div>
            {/* Balão de diálogo */}
            <div className='p-2 rounded-full duration-200 relative hover:bg-obscure z-50'>
                {/* Ícone que controla a abertura e o fechamento do balão */}
                <props.icon size={20} className="text-white" onClick={() => props.setOpen(!props.open)} />
                {/* Conteúdo do balão */}
                <div className={`w-max ${props.direction} ${props.open ? 'h-max' : 'h-0'} overflow-hidden  absolute flex flex-col`}>
                    <div className="mt-1 h-2 -mb-3 mx-3.5 relative">
                        {/* Triângulo na parte superior do balão */}
                        <div className={`h-2 w-2 rotate-45 bg-white absolute border-t border-l ${props.direction}`}>
                        </div>
                    </div>
                    {/* Corpo do balão */}
                    <div className="bg-white text-black my-2 rounded-md p-3 border">
                        {props.children} {/* Conteúdo passado como children */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ButtomBallon // Exporta o componente ButtomBallon como padrão para ser utilizado em outros arquivos
