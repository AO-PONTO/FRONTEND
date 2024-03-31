'use client'

import { propSelect } from '@/interface' // Importa a interface propSelect de um local específico
import React from 'react'
import { FaEye, FaEyeSlash, FaCaretDown, FaFile } from 'react-icons/fa' // Importa ícones do React

// Interface para as props do componente Input
interface propsInput {
  type: // Tipo do input
    | 'text'
    | 'password'
    | 'date'
    | 'select'
    | 'number'
    | 'checkbox'
    | 'textarea'
    | 'file'
  label: string // Rótulo do input
  name: string // Nome do input
  size?: 'w-1/2' | 'w-1/3' | 'w-2/3' | 'w-1/4' | 'w-full' // Tamanho do input
  data?: propSelect[] // Dados para input de seleção
  defaultValue?: string | number // Valor padrão do input
  setCheck?: React.Dispatch<React.SetStateAction<boolean>> // Função para atualizar o estado do checkbox
  disabled?: boolean // Indica se o input está desativado
  padding?: boolean // Indica se deve adicionar preenchimento ao input
  check?: boolean // Estado do checkbox
  value?: string | number // Valor do input
  onChange?: (Arg0: string, Arg1: string) => void // Função chamada ao alterar o valor do input
}

// Componente funcional 'Input'
const Input = (props: propsInput) => {
  const [visible, setVisible] = React.useState<boolean>(false) // Estado para controlar a visibilidade da senha
  const [inUse, setInUse] = React.useState<boolean>(props.disabled ? true : props.value === '' ? false : true) // Estado para indicar se o input está em uso
  const [check, setCheck] = React.useState<boolean>(props.check || false) // Estado do checkbox

  // Renderiza um input do tipo 'text'
  if (props.type === 'text') {
    return (
      <div
        className={`${
          props.size && props.size === 'w-1/2'
            ? 'md:flex-[1_0_40%]'
            : props.size === 'w-1/3'
              ? 'md:w-1/3'
              : props.size === 'w-2/3'
                ? 'md:w-2/3'
                : props.size === 'w-1/4'
                  ? 'md:w-1/4'
                  : 'md:w-full'
        } w-full flex flex-col my-2 relative ${props.padding ? 'px-2' : ''}`}
      >
        <label
          className={`absolute bg-white w-fit px-1 text-gray-600 ${inUse ? (props.padding ? 'left-3 -top-2 text-xs' : 'left-1 -top-2 text-xs') : props.padding ? 'left-4 top-2 text-base' : 'left-2 top-2 text-base'} z-10 transition-all pointer-events-none`}
        >
          {props.label}
        </label>
        <input
          className="p-2 border border-gray-500 rounded focus:outline-gray-600 focus:outline-offset-1"
          defaultValue={props.defaultValue || ''}
          type="text"
          disabled={props?.disabled && props.disabled}
          onFocus={() => setInUse(true)}
          onBlur={(e) => {
            props.disabled ? (setInUse(true))
            : (e.target.value ? setInUse(true) : setInUse(false))
          }}
          value={props.value || ''}
          onChange={(e) =>
            props?.onChange && props?.onChange(e.target.value, props.name)
          }
        />
      </div>
    )
  } 
  // Renderiza um input do tipo 'password'
  else if (props.type === 'password') {
    return (
      <div
        className={`${
          props.size && props.size === 'w-1/2'
            ? 'md:flex-[1_0_40%]'
            : props.size === 'w-1/3'
              ? 'md:w-1/3'
              : props.size === 'w-2/3'
                ? 'md:w-2/3'
                : props.size === 'w-1/4'
                  ? 'md:w-1/4'
                  : 'md:w-full'
        } w-full flex flex-col my-2 relative ${props.padding ? 'px-2' : ''} `}
      >
        <label
          className={`absolute bg-white w-fit px-1 text-gray-600 ${inUse ? (props.padding ? 'left-3 -top-2 text-xs' : 'left-1 -top-2 text-xs') : props.padding ? 'left-4 top-2 text-base' : 'left-2 top-2 text-base'} z-10 transition-all pointer-events-none`}
        >
          {props.label}
        </label>
        <input
          className="p-2 border border-gray-500 rounded focus:outline-gray-600 focus:outline-offset-1"
          type={visible ? 'text' : 'password'}
          disabled={props?.disabled && props.disabled}
          onFocus={() => setInUse(true)}
          onBlur={(e) => (e.target.value ? setInUse(true) : setInUse(false))}
          value={props.value || ''}
          onChange={(e) =>
            props?.onChange && props?.onChange(e.target.value, props.name)
          }
        />
        <button
          className="absolute right-2 bottom-0 p-2.5"
          onClick={() => setVisible(!visible)}
        >
          {visible ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
        </button>
      </div>
    )
  } 
  // Renderiza um input do tipo 'date'
  else if (props.type === 'date') {
    return (
      <div
        className={`${
          props.size && props.size === 'w-1/2'
            ? 'md:flex-[1_0_40%]'
            : props.size === 'w-1/3'
              ? 'md:w-1/3'
              : props.size === 'w-2/3'
                ? 'md:w-2/3'
                : props.size === 'w-1/4'
                  ? 'md:w-1/4'
                  : 'md:w-full'
        } w-full flex flex-col my-2 ${props.padding ? 'px-2' : ''} relative`}
      >
        <label
          className={`absolute bg-white w-fit px-1 text-gray-600 ${inUse ? (props.padding ? 'left-3 -top-2 text-xs' : 'left-1 -top-2 text-xs') : props.padding ? 'left-4 top-2 text-base' : 'left-2 top-2 text-base'} z-10 transition-all pointer-events-none`}
        >
          {props.label}
        </label>
        <input
          className={`p-[7px] border border-gray-500 ${inUse ? 'text-black' : 'text-white'} bg-white transition rounded focus:outline-gray-600 focus:outline-offset-1`}
          type="date"
          disabled={props?.disabled && props.disabled}
          placeholder=" "
          onFocus={() => setInUse(true)}
          onBlur={(e) => (e.target.value ? setInUse(true) : setInUse(false))}
          value={props.value || ''}
          onChange={(e) =>
            props?.onChange && props?.onChange(e.target.value, props.name)
          }
        />
      </div>
    )
  } 
  // Renderiza um input do tipo 'select'
  else if (props.type === 'select') {
    return (
      <div
        className={`${
          props.size && props.size === 'w-1/2'
            ? 'md:flex-[1_0_40%]'
            : props.size === 'w-1/3'
              ? 'md:w-1/3'
              : props.size === 'w-2/3'
                ? 'md:w-2/3'
                : props.size === 'w-1/4'
                  ? 'md:w-1/4'
                  : 'md:w-full'
        } w-full flex flex-col my-2 ${props.padding ? 'px-2' : ''} relative`}
      >
        <label
          className={`absolute bg-white w-fit px-1 text-gray-600 ${inUse ? (props.padding ? 'left-3 -top-2 text-xs' : 'left-1 -top-2 text-xs') : props.padding ? 'left-4 top-2 text-base' : 'left-2 top-2 text-base'} z-10 transition-all pointer-events-none`}
        >
          {props.label}
        </label>
        <select
          disabled={props?.disabled && props.disabled}
          className="p-[9px] border border-gray-500 rounded bg-white focus:outline-gray-600 focus:outline-offset-1"
          onFocus={() => setInUse(true)}
          onBlur={(e) => (e.target.value ? setInUse(true) : setInUse(false))}
          value={props.value || ''}
          onChange={(e) =>
            props?.onChange && props?.onChange(e.target.value, props.name)
          }
        >
          <option value={''}></option>
          {props.data &&
            props.data.map((ele) => (
              <option key={ele.uuid} value={ele.uuid}>
                {ele.name}
              </option>
            ))}
        </select>
        <FaCaretDown
          className="absolute right-[2px] top-0.5 p-2.5 bg-white rounded-sm text-gray-600 pointer-events-none"
          size={36}
        />
      </div>
    )
  } 
  // Renderiza um input do tipo 'number'
  else if (props.type === 'number') {
    return (
      <div
        className={`${
          props.size && props.size === 'w-1/2'
            ? 'md:flex-[1_0_40%]'
            : props.size === 'w-1/3'
              ? 'md:w-1/3'
              : props.size === 'w-2/3'
                ? 'md:w-2/3'
                : props.size === 'w-1/4'
                  ? 'md:w-1/4'
                  : 'md:w-full'
        } w-full flex flex-col my-2 ${props.padding ? 'px-2' : ''} relative`}
      >
        <label
          className={`absolute bg-white w-fit px-1 text-gray-600 ${inUse ? (props.padding ? 'left-3 -top-2 text-xs' : 'left-1 -top-2 text-xs') : props.padding ? 'left-4 top-2 text-base' : 'left-2 top-2 text-base'} z-10 transition-all pointer-events-none`}
        >
          {props.label}
        </label>
        <input
          className="p-2 border border-gray-500 rounded focus:outline-gray-600 focus:outline-offset-1"
          value={props.value || ''}
          onChange={(e) =>
            props?.onChange && props?.onChange(e.target.value, props.name)
          }
          disabled={props?.disabled && props.disabled}
          onFocus={() => setInUse(true)}
          onBlur={(e) => (e.target.value ? setInUse(true) : setInUse(false))}
          type="number"
        />
      </div>
    )
  } 
  // Renderiza um input do tipo 'checkbox'
  else if (props.type === 'checkbox') {
    return (
      <>
        <div
          className={`${
            props.size && props.size === 'w-1/2'
              ? 'md:flex-[1_0_40%]'
              : props.size === 'w-1/3'
                ? 'md:w-1/3'
                : props.size === 'w-2/3'
                  ? 'md:w-2/3'
                  : props.size === 'w-1/4'
                    ? 'md:w-1/4'
                    : 'md:w-full'
          } w-full flex my-2 ${props.padding ? 'px-2' : ''} relative`}
        >
          <div
            className="w-fit flex gap-2"
            onClick={() => {
              props?.setCheck && props?.setCheck(!check)
              setCheck(!check)
            }}
          >
            <input
              className=""
              checked={check}
              type="checkbox"
              id={props.label}
            />
            <label>{props.label}</label>
          </div>
        </div>
      </>
    )
  } 
  // Renderiza um input do tipo 'textarea'
  else if (props.type === 'textarea') {
    return (
      <div
        className={`${
          props.size && props.size === 'w-1/2'
            ? 'md:flex-[1_0_40%]'
            : props.size === 'w-1/3'
              ? 'md:w-1/3'
              : props.size === 'w-2/3'
                ? 'md:w-2/3'
                : props.size === 'w-1/4'
                  ? 'md:w-1/4'
                  : 'md:w-full'
        } w-full flex flex-col my-2 ${props.padding ? 'px-2' : ''} relative`}
      >
        <label
          className={`absolute bg-white w-fit px-1 text-gray-600 ${inUse ? (props.padding ? 'left-3 -top-2 text-xs' : 'left-1 -top-2 text-xs') : props.padding ? 'left-4 top-2 text-base' : 'left-2 top-2 text-base'} z-10 transition-all pointer-events-none`}
        >
          {props.label}
        </label>
        <textarea
          className="p-2 border border-gray-500 rounded focus:outline-gray-600 focus:outline-offset-1"
          defaultValue={props.defaultValue || ''}
          disabled={props?.disabled && props.disabled}
          onFocus={() => setInUse(true)}
          onBlur={(e) => (e.target.value ? setInUse(true) : setInUse(false))}
          rows={3}
          value={props.value || ''}
          onChange={(e) =>
            props?.onChange && props?.onChange(e.target.value, props.name)
          }
        />
      </div>
    )
  } 
  // Renderiza um input do tipo 'file'
  else if (props.type === 'file') {
    return (
      <div
        className={`${
          props.size && props.size === 'w-1/2'
            ? 'md:flex-[1_0_40%]'
            : props.size === 'w-1/3'
              ? 'md:w-1/3'
              : props.size === 'w-2/3'
                ? 'md:w-2/3'
                : props.size === 'w-1/4'
                  ? 'md:w-1/4'
                  : 'md:w-full'
        } w-full flex items-center my-2 ${props.padding ? 'px-2' : ''} relative cursor-pointer`}
      >
        <input
          type="file"
          className="absolute opacity-0 w-[calc(100%-50px)] h-full cursor-pointer z-10"
        />
        <button className="flex w-[calc(100%-50px)] py-2 text-sm font-medium px-4 justify-center rounded-md border border-transparent bg-primary shadow-md transition duration-150 hover:bg-primaryHover text-white">
          Subir Arquivo
        </button>
        <FaFile size={26} className="mx-3 text-gray-400" />
      </div>
    )
  }
}

export default Input // Exporta o componente Input
