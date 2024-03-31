import React from 'react'
import * as Components from '@/components' // Importa todos os componentes do diretório '@/components'
import ViewTurmas from './ProfessorView/ViewTurmas' // Importa o componente ViewTurmas do diretório './ProfessorView/ViewTurmas'
import ViewChamada from './ProfessorView/ViewChamada' // Importa o componente ViewChamada do diretório './ProfessorView/ViewChamada'ProfessorView/ViewCozinha'
import ViewRelatório from './ProfessorView/ViewRelatorio' // Importa o componente ViewRelatorio do diretório './ProfessorView/ViewRelatorio'

interface PropsProfessor {
  view: string; // Propriedade para definir a visualização atual
}

const Professor = (props: PropsProfessor) => {

  // Verifica se a visualização está vazia
  if (props.view === '') {
    return <></>; // Retorna vazio se a visualização estiver vazia
  } else {
    return (
      <Components.EstContainer size='giant' shadow="center" rounded="medium" scroll>
        {/* Renderiza o componente correspondente à visualização */}
        {props.view === 'Chamada' ? (
          <ViewChamada />
        ) : props.view === 'Turmas' ? (
          <ViewTurmas />
        ) : props.view === 'Relatorio' ? (
          <ViewRelatório setView={() => {}} />
        ) : (
          <></> // Retorna vazio se a visualização não for reconhecida
        )}
      </Components.EstContainer>
    );
  }
};

export default Professor; // Exporta o componente Professor
