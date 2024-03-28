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
import { dataSala, propsView } from '@/interface'
import { FaEdit, FaTrashAlt } from "react-icons/fa"
import { EstModal } from '@/components'
import ModEditSala from './ModEditSala'

const ViewListSala = (props: propsView) => {

  const [salas, setSalas] = React.useState<dataSala[]>([])
  const [sala, setSala] = React.useState<dataSala>()
  const [actionView, setActionView] = React.useState<string>('Listar')
  const [alert, setAlert] = React.useState<boolean>(false)
  const [uuid, setUuid] = React.useState<string>('')

  const handleSalas = async () => {
    const dataUser = localStorage.getItem('@aplication/aoponto')
    if (dataUser) {
      const tempUser = JSON.parse(dataUser)
      try {
        const response = await api.get('/salas', { params: { all: true , attribute : "escola_uuid", value: tempUser.user.escola_uuid } })
        if (response) {
          setSalas(response.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  React.useEffect(()=> {
    handleSalas()
  }, [])

  const deleteAction = async () => {
    try {
      await api.delete('/salas', { params: { uuid: uuid }})
      handleSalas()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {actionView === 'Listar' ? (
        <>
          <h1 className='text-lg w-full px-2'>Listar Séries</h1>
          <div className='flex flex-wrap p-2 w-full'>
          {salas.length === 0 ? (
            <p className='text-center w-full'>Aguarde alguns instantes...</p>
          ) : (
            <Table>
              <TableCaption>Lista de Séries.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Ações</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead>Turno</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salas.map((ele) => (
                  <TableRow key={ele.uuid}>
                    <TableCell className="font-medium flex gap-2">
                      <FaEdit onClick={() => {
                        setSala(ele)
                        setActionView('Edit')
                      }} />
                      <FaTrashAlt onClick={() => {
                        setUuid(ele.uuid)
                        setAlert(true)
                      }} />
                    </TableCell>
                    <TableCell>{ele.nome}</TableCell>
                    <TableCell>{ele.ano}</TableCell>
                    <TableCell>{ele.turno}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell>{salas.length} Séries Cadastradas</TableCell>
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
            <p className='text-center p-4'>Realmente deseja excluir esta série?</p>
          </EstModal>
        </>
      ) : (
        <>
          {sala && <ModEditSala form={sala} setView={setActionView} reset={handleSalas} /> }
        </>
      )}
      
    </>
  )
}

export default ViewListSala