import React, { MouseEventHandler } from 'react'
import { EleButton, EstContainer } from '.' // Importa componentes EleButton e EstContainer

// Interface para as props do componente Alert
interface propsAlert {
  open: boolean, // Estado que indica se o Alert está aberto ou fechado
  setAlert: MouseEventHandler<HTMLButtonElement>, // Função para lidar com o evento de clique no botão
  message: string // Mensagem exibida dentro do Alert
}

// Componente funcional 'Alert'
const Alert = (props: propsAlert) => {
  // Verifica se o Alert está aberto
  if (props.open) {
    return (
      // Estrutura do Alert
      <div className="absolute top-0 left-0 w-screen h-screen bg-[#00000077] flex justify-center items-center z-50">
        <EstContainer
          size="small" // Tamanho do contêiner
          shadow="center" // Sombra aplicada ao contêiner
          rounded="small" // Borda arredondada do contêiner
          border="none" // Estilo da borda do contêiner
        >
          {/* Mensagem exibida dentro do Alert */}
          <div className="flex w-full justify-center my-10 text-lg">
            {props.message}
          </div>
          {/* Botão para fechar o Alert */}
          <div className="flex w-full gap-2">
            <EleButton onClick={props.setAlert}>VOLTAR</EleButton>
          </div>
        </EstContainer>
      </div>
    )
  } else {
    return null // Retorna nulo se o Alert estiver fechado
  }
}

export default Alert // Exporta o componente Alert como padrão para ser utilizado em outros arquivos
