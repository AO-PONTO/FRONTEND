import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (data: Date) => {
  
  const dia = String(data.getDate()).padStart(2, '0')
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const ano = data.getFullYear()

  const horas = String(data.getHours()).padStart(2, '0')
  const minutos = String(data.getMinutes()).padStart(2, '0')
  const segundos = String(data.getSeconds()).padStart(2, '0')

  return `${ano}-${mes}-${dia} ${horas}:${minutos}:${segundos}`

}

export const formatShortDate = (data: Date) => {
  
  const dia = String(data.getDate()).padStart(2, '0')
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const ano = data.getFullYear()

  return `${ano}-${mes}-${dia}`

}

export const stringNumber = (str: string) => {
  const regex = /^[0-9]+$/
  return regex.test(str)
}
