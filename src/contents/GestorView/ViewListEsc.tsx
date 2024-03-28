import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import api from '@/service/api'
import { dataEsc, propsView } from '@/interface'
import { FaEdit, FaTrashAlt } from "react-icons/fa"
import ModEditEsc from './ModEditEsc'
import { EstModal } from '@/components'

const ViewListEsc = (props: propsView) => {

  const [escolas, setEscolas] = React.useState<dataEsc[]>([])
  const [escola, setEscola] = React.useState<dataEsc>()
  const [actionView, setActionView] = React.useState<string>('Listar')
  const [alert, setAlert] = React.useState<boolean>(false)
  const [uuid, setUuid] = React.useState<string>('')

  const handleEscolas = async () => {
  try {
    const response = await api.get('/escolas', { params: { all: true }})
    if (response) {
      setEscolas(response.data)
    }
  } catch (error) {
    console.log(error)
  }
  }

  React.useEffect(()=> {
    handleEscolas()
  }, [])


  const deleteAction = async () => {
    try {
      await api.delete('/escolas', { params: { uuid: uuid }})
      handleEscolas()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {actionView === 'Listar' ? (
        <>
          <h1 className='text-lg w-full px-2'>Listar Escolas</h1>
          <div className='flex flex-wrap p-2 w-full'>
          {escolas.length === 0 ? (
            <p className='text-center w-full'>Aguarde alguns instantes...</p>
          ) : (
            <Table>
              <TableCaption>Lista de Escolas.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Ações</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cod. INEP</TableHead>
                  <TableHead>Etapa de Ensino</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {escolas.map((ele) => (
                  <TableRow key={ele.uuid}>
                    <TableCell className="font-medium flex gap-2">
                      <FaEdit onClick={() => {
                        setEscola(ele)
                        setActionView('Edit')
                      }} />
                      <FaTrashAlt onClick={() => {
                        setUuid(ele.uuid)
                        setAlert(true)
                      }} />
                    </TableCell>
                    <TableCell>{ele.nome}</TableCell>
                    <TableCell>{ele.inep_codigo}</TableCell>
                    <TableCell>{ele.etapa_ensino}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell>{escolas.length} Escolas Cadastradas</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          )}
          </div>
          <EstModal 
            confirm={() => {
              deleteAction()
              setAlert(false)
            }} 
            exit={() => {
              setActionView('Listar')
              setAlert(false)
            }}
            open={alert}>
            <p className='text-center p-4'>Realmente deseja excluir esta escola?</p>
          </EstModal>
        </>
      ) : (
        <>
          {escola && <ModEditEsc form={escola} setView={setActionView} reset={handleEscolas}/> }
        </>
      )}
      
    </>
  )
}

export default ViewListEsc