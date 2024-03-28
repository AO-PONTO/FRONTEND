import { IconType } from 'react-icons'

type menuItem = {
  label: string
  icon: IconType
}
export type sectionElements = {
  userType: string
  menu: menuItem[]
}
