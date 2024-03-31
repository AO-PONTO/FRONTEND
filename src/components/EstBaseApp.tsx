import React from 'react'
import * as Base from './base' // Importação dos componentes base da aplicação
import { sectionElements } from '@/data/sections' // Importação dos dados das seções da aplicação

// Definição das propriedades do componente BaseApp
interface propsBaseApp {
  children: React.ReactNode, // Conteúdo principal da página
  setLogged: React.Dispatch<React.SetStateAction<boolean>>, // Função para atualizar o estado de login
  setView: React.Dispatch<React.SetStateAction<string>>, // Função para atualizar a visualização da página
  data: sectionElements | null // Dados das seções da aplicação
}

// Componente BaseApp responsável pelo layout básico da aplicação
const BaseApp = (props: propsBaseApp) => {
  return (
    <div className='flex w-full h-full'>
      {/* Barra de navegação que recebe dados das seções, funções para atualizar o login e a visualização */}
      <Base.Navbar data={props.data} setLogged={props.setLogged} setView={props.setView}>
        {/* Estrutura flexível para organizar os componentes dentro da barra de navegação */}
        <div className='w-full h-full flex flex-col justify-between'>
          {/* Componente do cabeçalho */}
          <Base.Header />
          {/* Área principal da página, onde o conteúdo principal é renderizado */}
          <div className='w-full h-[calc(100%-100px)] flex justify-center items-center'>
            {props.children} {/* Conteúdo principal da página */}
          </div>
          {/* Componente do rodapé */}
          <Base.Footer />
        </div>
      </Base.Navbar>
    </div>
  )
}

export default BaseApp // Exportação do componente BaseApp
