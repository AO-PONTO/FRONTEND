import React from 'react'
import Logo from '@/assets/logo.png' // Importa o logotipo da aplicação
import ButtomBallon from '../EleButtomBallon' // Importa o componente ButtomBallon
import {
  FaChevronRight,
  FaChevronLeft,
  FaSignOutAlt,
  FaBars,
} from 'react-icons/fa' // Importa ícones do React
import Image from 'next/image' // Importa o componente de imagem do Next.js
import { sectionElements } from '@/interface/global_types' // Importa tipos de seção

// Interface para as props do Navbar
interface propsNavbar {
  children: React.ReactNode // Conteúdo a ser exibido dentro do Navbar
  setLogged: React.Dispatch<React.SetStateAction<boolean>> // Função para atualizar o estado de login
  setView: React.Dispatch<React.SetStateAction<string>> // Função para atualizar a visualização
  data: sectionElements | null // Dados da seção
}

// Componente funcional 'Navbar'
const Navbar = (props: propsNavbar) => {
  const [expanded, setExpanded] = React.useState<boolean>(true) // Estado para controlar a expansão do Navbar

  // Efeito para verificar a largura da janela e definir o estado de expansão
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setExpanded(window.innerWidth > 767)
    }
  }, [])

  return (
    <>
      {/* Navbar para telas grandes */}
      <nav
        className={`${expanded ? 'w-[240px] 2xl:w-[280px]' : 'w-[64px]'} hidden md:flex transition-all duration-300 bg-white border-r  flex-col justify-between`}
      >
        <div>
          <div
            className={`${expanded ? 'h-[192px] 2xl:h-[224px] mb-8' : 'h-[64px] mb-0'} flex items-center transition-all duration-300 relative border-b`}
          >
            {expanded && ( // Exibe o logotipo apenas se o Navbar estiver expandido
              <div className="w-full">
                <Image
                  className="px-8"
                  src={Logo}
                  height={280}
                  width={280}
                  alt="logo"
                />
              </div>
            )}
            {/* Botão de expansão do Navbar */}
            <button
              className={`${expanded ? 'top-[87px] right-0 ' : 'top-[7px] right-[7px]'} transition-all duration-300 absolute p-2.5 m-1.5 rounded-full hover:bg-gray-100`}
              onClick={() => setExpanded(!expanded)} // Alterna entre expandido e recolhido ao clicar no botão
            >
              {expanded ? ( // Ícone de seta dependendo do estado de expansão do Navbar
                <FaChevronRight size={18} className='text-primaryHover' />
              ) : (
                <FaChevronLeft size={18} className='text-primaryHover' />
              )}
            </button>
            {expanded && ( // Exibe 'MENU' apenas se o Navbar estiver expandido
              <div className="absolute -bottom-2.5 w-full flex justify-center">
                <p className="text-xs bg-white px-2 left-1/2 inline-block">
                  MENU
                </p>
              </div>
            )}
          </div>
          {/* Lista de itens do Navbar */}
          <ul className="overflow-hidden">
            {props?.data?.menu.map((element) => (
              <li className="w-full" key={element.label}>
                {/* Botão para cada item do menu */}
                <button
                  onClick={() => props.setView(element.label)} // Define a visualização com base no item do menu clicado
                  className="py-3.5 px-5 flex gap-8 w-full transition-all text-black  hover:bg-blue-50 active:bg-blue-100"
                >
                  {/* Ícone do item do menu */}
                  <element.icon className="min-w-[22px] text-primaryHover" size={22} />
                  {expanded ? <p>{element.label}</p> : <></>} {/* Exibe o rótulo do item do menu apenas se o Navbar estiver expandido */}
                </button>
              </li>
            ))}
            {/* Botão para sair (logout) */}
            <li>
              <button
                onClick={() => {
                  props.setLogged(false) // Define o estado de login como falso
                  localStorage.removeItem('@aplication/aoponto') // Remove os dados de login do armazenamento local
                }}
                className="py-3.5 px-5 flex gap-8 w-full transition-all text-black  hover:bg-blue-50 active:bg-blue-100"
              >
                <FaSignOutAlt className="min-w-[22px] text-primaryHover" size={22} />
                {expanded ? <p>Sair</p> : <></>} {/* Exibe 'Sair' apenas se o Navbar estiver expandido */}
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Navbar para telas pequenas (responsivo) */}
      <div className="absolute p-3.5 block md:hidden ">
        <ButtomBallon
          direction="left-0"
          icon={FaBars} // Ícone para abrir o menu no modo responsivo
          open={expanded}
          setOpen={setExpanded}
        >
          {/* Lista de itens do Navbar para telas pequenas (responsivo) */}
          <ul className="overflow-hidden">
            {props?.data?.menu.map((element) => (
              <li className="w-full" key={element.label}>
                {/* Botão para cada item do menu */}
                <button
                  onClick={() => {
                    props.setView(element.label) // Define a visualização com base no item do menu clicado
                    setExpanded(!expanded) // Alterna entre expandido e recolhido ao clicar no botão
                  }}
                  className="p-3.5 flex gap-4 w-full text-black"
                >
                  {/* Ícone do item do menu */}
                  <element.icon className="min-w-[22px] text-primaryHover" size={22} />
                  {expanded ? <p>{element.label}</p> : <></>} {/* Exibe o rótulo do item do menu apenas se o Navbar estiver expandido */}
                </button>
              </li>
            ))}
            {/* Botão para sair (logout) */}
            <li>
              <button
                onClick={() => {
                  props.setLogged(false) // Define o estado de login como falso
                  localStorage.removeItem('@aplication/aoponto') // Remove os dados de login do armazenamento local
                }}
                className="p-3.5 flex gap-4 w-full text-black"
              >
                <FaSignOutAlt className="min-w-[22px] text-primaryHover" size={22} />
                {expanded ? <p>Sair</p> : <></>} {/* Exibe 'Sair' apenas se o Navbar estiver expandido */}
              </button>
            </li>
          </ul>
        </ButtomBallon>
      </div>

      {/* Conteúdo principal da página */}
      <div
        className={`${expanded ? 'md:w-[calc(100%-240px)] 2xl:w-[calc(100%-280px)]' : 'md:w-[calc(100%-64px)]'} w-full transition-all duration-300`}
      >
        {props.children} {/* Renderiza o conteúdo principal passado como children */}
      </div>
    </>
  )
}

export default Navbar // Exporta o componente Navbar como padrão para ser utilizado em outros arquivos
