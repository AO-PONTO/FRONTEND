import React from 'react'
import * as Components from '@/components'
import ViewCadUser from './GestorView/ViewCadUser'
import ViewListUser from './GestorView/ViewListUser'
import ViewCadEsc from './GestorView/ViewCadEsc'
import ViewListEsc from './GestorView/ViewListEsc'
import ViewCadDisc from './GestorView/ViewCadDisc'
import ViewListDisc from './GestorView/ViewListDisc'

interface propsGestor {
    view: string
}

const Actions = ['Cadastrar', 'Listar']

const Gestor = (props:propsGestor) => {
  const [action, setAction] = React.useState<string>('Cadastrar')

  if (props.view === '') {
      return <></>
  } else {
      return (
          <Components.EstContainer size='giant' shadow='center' rounded='medium' scroll>
              <Components.EleActions action={action} setAction={setAction} label={Actions} />
              {action === 'Cadastrar' ? (
                <>
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

export default Gestor
