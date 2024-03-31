'use client'
import React from 'react'
import * as Component from '@/components'
import * as Contents from '@/contents'
import { sectionDiretor, sectionProfessor, sectionMerendeira, sectionElements, sectionGestor, sectionNutricionista } from '@/data/sections'

// Componente funcional 'Home'
// Este componente representa a página inicial da aplicação
export default function Home() {
  // Estados para controle de autenticação, visualização e seção
  const [logged, setLogged] = React.useState<boolean>(false) // Estado para verificar se o usuário está autenticado
  const [view, setView] = React.useState<string>('') // Estado para controlar a visualização de páginas
  const [section, setSection] = React.useState<sectionElements | null>(null) // Estado para definir a seção com base no nível de acesso do usuário
  const [login, setLogin] = React.useState<number>(0) // Estado para armazenar o nível de acesso do usuário após o login
  const pass = 'string' // Senha para autenticação

  // Função para verificar e recuperar informações de login do armazenamento local
  const cacheLogin = () => {
    if (localStorage.getItem('@aplication/aoponto')){
      const info = localStorage.getItem('@aplication/aoponto') || ''
      const infoUser = JSON.parse(info)
      setLogin(infoUser.user.access_level)
      setLogged(true)
    }
  }

  // Efeito para verificar o login e definir a seção com base no nível de acesso do usuário
  React.useEffect(() => {
    cacheLogin()
    if (login === 4) {
      setSection(sectionDiretor)
    } else if (login === 2) {
      setSection(sectionProfessor)
    } else if (login === 1) {
      setSection(sectionMerendeira)
    } else if (login === 5) {
      setSection(sectionGestor)
    } else if (login === 3) {
      setSection(sectionNutricionista)
    } else {
      setSection(null)
    }
  }, [login])

  return (
    <>
      {/* Componente de tela cheia */}
      <Component.EstFullScreen>
        {!logged ? ( // Se o usuário não estiver autenticado, exibe a página de login
          <Contents.PageLogin pass={pass} setLogin={setLogin} setLogged={setLogged} />
        ) : ( // Se o usuário estiver autenticado, exibe o aplicativo base com conteúdo correspondente ao seu nível de acesso
          <Component.EstBaseApp data={section} setLogged={setLogged} setView={setView}>
            <>
              {/* Renderiza a página correspondente com base no nível de acesso */}
              {login === 5 ? ( // Se o nível de acesso for 5 (Gestor), renderiza a página do Gestor
                <Contents.PageGestor view={view} />
              ) : login === 4 ? ( // Se o nível de acesso for 4 (Diretor), renderiza a página do Diretor
                <Contents.PageDiretor view={view} />
              ) : login === 3 ? ( // Se o nível de acesso for 3 (Nutricionista), renderiza a página do Nutricionista
                <Contents.PageNutricionista view={view} />
              ) : login === 2 ? ( // Se o nível de acesso for 2 (Professor), renderiza a página do Professor
                <Contents.PageProfessor view={view} />
              ) : login === 1 ? ( // Se o nível de acesso for 1 (Merendeira), renderiza a página da Merendeira
                <Contents.PageMerendeira view={view} />
              ) : (<></>)} {/* Se nenhum nível de acesso correspondente for encontrado, renderiza um fragmento vazio */}
            </>
          </Component.EstBaseApp>
        )}
      </Component.EstFullScreen>
    </>
  )
}
