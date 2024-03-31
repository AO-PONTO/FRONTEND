import React from 'react'
import * as Components from '@/components' // Importa todos os componentes do diretório '@/components'
import ViewCadCard from './NutricionistaView/ViewCadCard' // Importa o componente ViewCadCard do diretório './NutricionistaView/ViewCadCard'
import ViewListCard from './NutricionistaView/ViewListCard' // Importa o componente ViewListCard do diretório './NutricionistaView/ViewListCard'
import ViewCadAtr from './NutricionistaView/ViewCadAtr' // Importa o componente ViewCadAtr do diretório './NutricionistaView/ViewCadAtr'
import ViewListAtr from './NutricionistaView/ViewListAtr' // Importa o componente ViewListAtr do diretório './NutricionistaView/ViewListAtr'

interface propsNutricionista {
  view: string // Propriedade para definir a visualização atual
}

const Actions = ['Cadastrar', 'Listar'] // Array de ações disponíveis

const Nutricionista = (props: propsNutricionista) => {
  const [action, setAction] = React.useState<string>('Cadastrar') // Estado para controlar a ação atual

  // Verifica se a visualização está vazia
  if (props.view === '') {
    return <></> // Retorna vazio se a visualização estiver vazia
  } else {
    return (
      <Components.EstContainer size='giant' shadow='center' rounded='medium' scroll>
        {/* Renderiza o componente EleActions com a ação atual e as opções disponíveis */}
        <Components.EleActions action={action} setAction={setAction} label={Actions} />
        {/* Verifica a ação atual */}
        {action === 'Cadastrar' ? (
          <>
            {/* Renderiza o componente correspondente à visualização e à ação atual */}
            {props.view === 'Cardápio' ? (
              <ViewCadCard setView={setAction} />
            ): props.view === 'Atribuição' ? (
              <ViewCadAtr setView={setAction} />
            ): (<></>)} {/* Retorna vazio se a visualização não for correspondente */}
          </>
        ) : action === 'Listar' ? (
          <>
            {/* Renderiza o componente correspondente à visualização e à ação atual */}
            {props.view === 'Cardápio' ? (
              <ViewListCard setView={setAction} />
            ): props.view === 'Atribuição' ? (
              <ViewListAtr setView={setAction} />
            ): (<></>)} {/* Retorna vazio se a visualização não for correspondente */}
          </>
        ) : (<></>)} {/* Retorna vazio se a ação atual não for reconhecida */}
      </Components.EstContainer>
    )
  }
}

export default Nutricionista // Exporta o componente Nutricionista
