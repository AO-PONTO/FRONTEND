import React from 'react'
import * as Components from '@/components'
import ViewCadUser from './DiretorView/ViewCadUser'
import ViewListUser from './DiretorView/ViewListUser'
import ViewCadSala from './DiretorView/ViewCadSala'
import ViewListSala from './DiretorView/ViewListSala'
import ViewCadAluno from './DiretorView/ViewCadAluno'
import ViewListAluno from './DiretorView/ViewListAluno'
import ViewListTurma from './DiretorView/ViewListTurma'
import ViewCadTurma from './DiretorView/ViewCadTurma'
import ViewRelatório from './DiretorView/ViewRelatorio'
import ViewCadComporTurma from './DiretorView/ViewCadComporTurma'
import ViewListComporTurma from './DiretorView/ViewListComporTurma'


interface propsDiretor {
  view: string
}

const Actions = ['Cadastrar', 'Listar']

const Diretor = (props:propsDiretor) => {
  const [action, setAction] = React.useState<string>('Cadastrar')
  if (props.view === '') {
    return <></>
  } else {
    return (
      <Components.EstContainer size='giant' shadow='center' rounded='medium' scroll>
        {props.view === 'Relatórios' ? (
          <ViewRelatório />
        ): (
          <>
            <Components.EleActions action={action} setAction={setAction} label={Actions} />
            {action === 'Cadastrar' ? (
              <>
                {props.view === 'Usuários' ? (
                  <ViewCadUser setView={setAction} />
                ): props.view === 'Séries' ? (
                  <ViewCadSala setView={setAction} />
                ): props.view === 'Turmas' ? (
                  <ViewCadTurma setView={setAction} />
                ): props.view === 'Alunos' ? (
                  <ViewCadAluno setView={setAction} />
                ): props.view === 'Compor Turma' ? (
                  <ViewCadComporTurma setView={setAction} />
                ): (<></>)}
              </>
            ) : action === 'Listar' ? (
              <>
                {props.view === 'Usuários' ? (
                  <ViewListUser setView={setAction} />
                ): props.view === 'Séries' ? (
                  <ViewListSala setView={setAction} />
                ): props.view === 'Turmas' ? (
                  <ViewListTurma setView={setAction}/>
                ): props.view === 'Alunos' ? (
                  <ViewListAluno setView={setAction} />
                ): props.view === 'Compor Turma' ? (
                  <ViewListComporTurma setView={setAction} />
                ):  (<></>)}
              </>
            ) : (<></>)}
          </>
        )}
        
      </Components.EstContainer>
    )
  }
}

export default Diretor