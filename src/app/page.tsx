'use client'
import React from 'react'
import * as Component from '@/components'
import * as Contents from '@/contents'
import { sectionDiretor, sectionProfessor, sectionMerendeira, sectionElements, sectionGestor, sectionNutricionista } from '@/data/sections'

export default function Home() {
  const [logged, setLogged] = React.useState<boolean>(false)
  const [view, setView] = React.useState<string>('')
  const [section, setSection] = React.useState<sectionElements | null>(null)
  const [login, setLogin] = React.useState<number>(0)
  const pass = 'string'

  const cacheLogin = () => {
    if (localStorage.getItem('@aplication/aoponto')){
      const info = localStorage.getItem('@aplication/aoponto') || ''
      const infoUser = JSON.parse(info)
      setLogin(infoUser.user.access_level)
      setLogged(true)
    }
  }

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
      <Component.EstFullScreen>
        {!logged ? (
          <Contents.PageLogin pass={pass} setLogin={setLogin} setLogged={setLogged} />
        ) : (
          <Component.EstBaseApp data={section} setLogged={setLogged} setView={setView}>
            <>
              {login === 5 ? (
                <Contents.PageGestor view={view} />
              ) : login === 4 ? (
                <Contents.PageDiretor view={view} />
              ) : login === 3 ? (
                <Contents.PageNutricionista view={view} />
              ) : login === 2 ? (
                <Contents.PageProfessor view={view} />
              ) : login === 1 ? (
                <Contents.PageMerendeira view={view} />
              ) : (<></>)}
            </>
          </Component.EstBaseApp>
        )}
      </Component.EstFullScreen>
    </>
  )
}
