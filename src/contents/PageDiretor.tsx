import React from 'react'
import * as Components from '@/components' // Importa todos os componentes do diretório '@/components'
import ViewCadUser from './DiretorView/ViewCadUser' // Importa o componente ViewCadUser da pasta DiretorView
import ViewListUser from './DiretorView/ViewListUser' // Importa o componente ViewListUser da pasta DiretorView
import ViewCadSala from './DiretorView/ViewCadSala' // Importa o componente ViewCadSala da pasta DiretorView
import ViewListSala from './DiretorView/ViewListSala' // Importa o componente ViewListSala da pasta DiretorView
import ViewCadAluno from './DiretorView/ViewCadAluno' // Importa o componente ViewCadAluno da pasta DiretorView
import ViewListAluno from './DiretorView/ViewListAluno' // Importa o componente ViewListAluno da pasta DiretorView
import ViewListTurma from './DiretorView/ViewListTurma' // Importa o componente ViewListTurma da pasta DiretorView
import ViewCadTurma from './DiretorView/ViewCadTurma' // Importa o componente ViewCadTurma da pasta DiretorView
import ViewRelatório from './DiretorView/ViewRelatorio' // Importa o componente ViewRelatorio da pasta DiretorView
import ViewCadComporTurma from './DiretorView/ViewCadComporTurma' // Importa o componente ViewCadComporTurma da pasta DiretorView
import ViewListComporTurma from './DiretorView/ViewListComporTurma' // Importa o componente ViewListComporTurma da pasta DiretorView

interface propsDiretor {
  view: string // Propriedade que indica a visualização atual do diretor
}

const Actions = ['Cadastrar', 'Listar'] // Lista de ações disponíveis

const Diretor = (props: propsDiretor) => {
  const [action, setAction] = React.useState<string>('Cadastrar') // Estado para controlar a ação selecionada

  // Verifica se a visualização atual está vazia
  if (props.view === '') {
    return <></> // Retorna um fragmento vazio caso a visualização esteja vazia
  } else {
    return (
      // Renderiza um componente de container estilizado
      <Components.EstContainer size='giant' shadow='center' rounded='medium' scroll>
        {/* Verifica se a visualização atual é de 'Relatórios' */}
        {props.view === 'Relatórios' ? (
          <ViewRelatório /> // Renderiza o componente ViewRelatório caso a visualização seja de relatórios
        ) : (
          <>
            {/* Renderiza o componente de ações com base na ação selecionada */}
            <Components.EleActions action={action} setAction={setAction} label={Actions} />
            {/* Verifica a ação selecionada e renderiza o componente correspondente */}
            {action === 'Cadastrar' ? (
              <>
                {/* Verifica a visualização atual e renderiza o componente correspondente para cada visualização */}
                {props.view === 'Usuários' ? (
                  <ViewCadUser setView={setAction} />
                ) : props.view === 'Séries' ? (
                  <ViewCadSala setView={setAction} />
                ) : props.view === 'Turmas' ? (
                  <ViewCadTurma setView={setAction} />
                ) : props.view === 'Alunos' ? (
                  <ViewCadAluno setView={setAction} />
                ) : props.view === 'Compor Turma' ? (
                  <ViewCadComporTurma setView={setAction} />
                ) : (<></>)}
              </>
            ) : action === 'Listar' ? (
              <>
                {/* Verifica a visualização atual e renderiza o componente correspondente para cada visualização */}
                {props.view === 'Usuários' ? (
                  <ViewListUser setView={setAction} />
                ) : props.view === 'Séries' ? (
                  <ViewListSala setView={setAction} />
                ) : props.view === 'Turmas' ? (
                  <ViewListTurma setView={setAction}/>
                ) : props.view === 'Alunos' ? (
                  <ViewListAluno setView={setAction} />
                ) : props.view === 'Compor Turma' ? (
                  <ViewListComporTurma setView={setAction} />
                ) :  (<></>)}
              </>
            ) : (<></>)}
          </>
        )}
      </Components.EstContainer>
    )
  }
}

export default Diretor // Exporta o componente Diretor
