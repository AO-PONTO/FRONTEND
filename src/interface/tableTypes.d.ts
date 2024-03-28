import { IconType } from 'react-icons'
import * as Interface from '@/interface'

export type MenuActionType = {
  title: string
  icon: IconType
  onClick: string
}

export type employeerType = {
  uuid: string
  registration: string
  name: string
  ordinance: string
  ordinance_pdf: string
  start_date?: string
}

export type processType = {
  uuid: string
  process_number: string
  process_ordinance: string
  start_date: string
}

export type KeyRow = keyof employeerType | keyof processType

type MaskKeys = 'cpf' | 'phone' | 'text' | 'cap' | 'date' | 'datetime'

export type Row = {
  [key in KeyRow]?: string
} & (userType | taskType | projectType)

export type TableColumnTypes = {
  key: string
  label: string
  name: Interface.KeyRow
  hide: boolean
  mask?: Interface.MaskKeys
}

export type TablePropsTypes = {
  title: string
  columns: TableColumnTypes[]
  rows: Interface.Row[]
  menuAction?: MenuActionType[]
  menuOnClick?: (type: string, uuid: string) => void
}

export interface DataObject {
  [key: string]: string | number
}
