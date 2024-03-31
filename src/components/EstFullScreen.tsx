import React from 'react'

// Definição das propriedades do componente FullScreen
interface propsFullScreen {
    children: React.ReactNode // Conteúdo a ser renderizado em tela cheia
}

// Componente FullScreen que renderiza o conteúdo em tela cheia
const FullScreen = (props: propsFullScreen) => {
    return (
        <div className="flex justify-center items-center max-w-full max-h-full w-full h-screen overflow-hidden bg-bgApp">
            {props.children} {/* Conteúdo a ser renderizado em tela cheia */}
        </div>
    )
}

export default FullScreen // Exportação do componente FullScreen
