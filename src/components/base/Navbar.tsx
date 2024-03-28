import React from 'react'
import Logo from '@/assets/logo.png'
import ButtomBallon from '../EleButtomBallon'
import {
  FaChevronRight,
  FaChevronLeft,
  FaSignOutAlt,
  FaBars,
} from 'react-icons/fa'
import Image from 'next/image'
import { sectionElements } from '@/interface/global_types'

interface propsNavbar {
  children: React.ReactNode
  setLogged: React.Dispatch<React.SetStateAction<boolean>>
  setView: React.Dispatch<React.SetStateAction<string>>
  data: sectionElements | null
}

const Navbar = (props: propsNavbar) => {
  const [expanded, setExpanded] = React.useState<boolean>(true)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setExpanded(window.innerWidth > 767)
    }
  }, [])
  return (
    <>
      <nav
        className={`${expanded ? 'w-[240px] 2xl:w-[280px]' : 'w-[64px]'} hidden md:flex transition-all duration-300 bg-white border-r  flex-col justify-between`}
      >
        <div>
          <div
            className={`${expanded ? 'h-[192px] 2xl:h-[224px] mb-8' : 'h-[64px] mb-0'} flex items-center transition-all duration-300 relative border-b`}
          >
            {expanded && (
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
            <button
              className={`${expanded ? 'top-[87px] right-0 ' : 'top-[7px] right-[7px]'} transition-all duration-300 absolute p-2.5 m-1.5 rounded-full hover:bg-gray-100`}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <FaChevronRight size={18} className='text-primaryHover' />
              ) : (
                <FaChevronLeft size={18} className='text-primaryHover' />
              )}
            </button>
            {expanded && (
              <div className="absolute -bottom-2.5 w-full flex justify-center">
                <p className="text-xs bg-white px-2 left-1/2 inline-block">
                  MENU
                </p>
              </div>
            )}
          </div>
          <ul className="overflow-hidden">
            {props?.data?.menu.map((element) => (
              <li className="w-full" key={element.label}>
                <button
                  onClick={() => props.setView(element.label)}
                  className="py-3.5 px-5 flex gap-8 w-full transition-all text-black  hover:bg-blue-50 active:bg-blue-100"
                >
                  <element.icon className="min-w-[22px] text-primaryHover" size={22} />
                  {expanded ? <p>{element.label}</p> : <></>}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => {
                  props.setLogged(false)
                  localStorage.removeItem('@aplication/aoponto')
                }}
                className="py-3.5 px-5 flex gap-8 w-full transition-all text-black  hover:bg-blue-50 active:bg-blue-100"
              >
                <FaSignOutAlt className="min-w-[22px] text-primaryHover" size={22} />
                {expanded ? <p>Sair</p> : <></>}
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <div className="absolute p-3.5 block md:hidden ">
        <ButtomBallon
          direction="left-0"
          icon={FaBars}
          open={expanded}
          setOpen={setExpanded}
        >
          <ul className="overflow-hidden">
            {props?.data?.menu.map((element) => (
              <li className="w-full" key={element.label}>
                <button
                  onClick={() => {
                    props.setView(element.label)
                    setExpanded(!expanded)
                  }}
                  className="p-3.5 flex gap-4 w-full text-black"
                >
                  <element.icon className="min-w-[22px] text-primaryHover" size={22} />
                  {expanded ? <p>{element.label}</p> : <></>}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => {
                  props.setLogged(false)
                  localStorage.removeItem('@aplication/aoponto')
                }}
                className="p-3.5 flex gap-4 w-full text-black"
              >
                <FaSignOutAlt className="min-w-[22px] text-primaryHover" size={22} />
                {expanded ? <p>Sair</p> : <></>}
              </button>
            </li>
          </ul>
        </ButtomBallon>
      </div>
      <div
        className={`${expanded ? 'md:w-[calc(100%-240px)] 2xl:w-[calc(100%-280px)]' : 'md:w-[calc(100%-64px)]'} w-full transition-all duration-300`}
      >
        {props.children}
      </div>
    </>
  )
}

export default Navbar
