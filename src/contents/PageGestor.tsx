import React from 'react'
import * as Components from '@/components' // Importa todos os componentes do diretório '@/components'
import ViewCadUser from './GestorView/ViewCadUser' // Importa o componente ViewCadUser da pasta GestorView
import ViewListUser from './GestorView/ViewListUser' // Importa o componente ViewListUser da pasta GestorView
import ViewCadEsc from './GestorView/ViewCadEsc' // Importa o componente ViewCadEsc da pasta GestorView
import ViewListEsc from './GestorView/ViewListEsc' // Importa o componente ViewListEsc da pasta GestorView
import ViewCadDisc from './GestorView/ViewCadDisc' // Importa o componente ViewCadDisc da pasta GestorView
import ViewListDisc from './GestorView/ViewListDisc' // Importa o componente ViewListDisc da pasta GestorView

interface propsGestor {
    view: string // Propriedade que indica a visualização atual do gestor
}

const Actions = ['Cadastrar', 'Listar'] // Lista de ações disponíveis

const Gestor = (props: propsGestor) => {
  const [action, setAction] = React.useState<string>('Cadastrar') // Estado para controlar a ação selecionada

  // Verifica se a visualização atual está vazia
  if (props.view === '') {
      return <></> // Retorna um fragmento vazio caso a visualização esteja vazia
  } else {
      return (
          // Renderiza um componente de container estilizado
          <Components.EstContainer size='giant' shadow='center' rounded='medium' scroll>
              {/* Renderiza o componente de ações com base na ação selecionada */}
              <Components.EleActions action={action} setAction={setAction} label={Actions} />
              {/* Verifica a ação selecionada e renderiza o componente correspondente */}
              {action === 'Cadastrar' ? (
                <>
                  {/* Verifica a visualização atual e renderiza o componente correspondente para cada visualização */}
                  {props.view === 'Escolas' ? (
                    <ViewCadEsc setView={setAction}/>
                  ): props.view === 'Usuários' ? (
                    <ViewCadUser setView={setAction} />
                  ): props.view === 'Disciplinas' ? (
                    <ViewCadDisc setView={setAction} />
                  ): (<></>)}
                </>
              ) : (
                <>
                {/* Verifica a visualização atual e renderiza o componente correspondente para cada visualização */}
                {props.view === 'Escolas' ? (
                  <ViewListEsc setView={setAction} />
                ): props.view === 'Usuários' ? (
                  <ViewListUser setView={setAction} />
                ): props.view === 'Disciplinas' ? (
                  <ViewListDisc setView={setAction} />
                ): (<></>)}
                </>
              )}
          </Components.EstContainer>
      )
  }
}

export default Gestor // Exporta o componente Gestor
