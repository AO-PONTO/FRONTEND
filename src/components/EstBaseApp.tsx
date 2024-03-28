import React from 'react'
import * as Base from './base'
import { sectionElements } from '@/data/sections'

interface propsBaseApp {
  children: React.ReactNode,
  setLogged: React.Dispatch<React.SetStateAction<boolean>>,
  setView: React.Dispatch<React.SetStateAction<string>>,
  data: sectionElements | null
}

const BaseApp = (props:propsBaseApp) => {
  return (
    <div className='flex w-full h-full'>
      <Base.Navbar data={props.data} setLogged={props.setLogged} setView={props.setView}>
        <div className='w-full h-full flex flex-col justify-between'>
          <Base.Header />
          <div className='w-full h-[calc(100%-100px)] flex justify-center items-center'>
            {props.children}
          </div>
          <Base.Footer />
        </div>
      </Base.Navbar>
    </div>
  )
}

export default BaseApp