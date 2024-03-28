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
import { dataDisciplinas, propsView } from '@/interface'
import { FaEdit, FaTrashAlt } from "react-icons/fa"
import { EstModal } from '@/components'
import ModEditDisc from './ModEditDisc'

const ViewListDisc = (props: propsView) => {

  const [discs, setDiscs] = React.useState<dataDisciplinas[]>([])
  const [disc, setDisc] = React.useState<dataDisciplinas>()
  const [actionView, setActionView] = React.useState<string>('Listar')
  const [alert, setAlert] = React.useState<boolean>(false)
  const [uuid, setUuid] = React.useState<string>('')

  const handleDiscs = async () => {
    try {
      const response = await api.get('/disciplinas', { params: { all: true } })
      if (response) {
        setDiscs(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(()=> {
    handleDiscs()
  }, [])

  const deleteAction = async () => {
    try {
      await api.delete('/disciplinas', { params: { uuid: uuid }})
      handleDiscs()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {actionView === 'Listar' ? (
        <>
          <h1 className='text-lg w-full px-2'>Listar Disciplinas</h1>
          <div className='flex flex-wrap p-2 w-full'>
          {discs.length === 0 ? (
            <p className='text-center w-full'>Aguarde alguns instantes...</p>
          ) : (
            <Table>
              <TableCaption>Lista de Disciplinas.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Ações</TableHead>
                  <TableHead>Nome</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {discs.map((ele) => (
                  <TableRow key={ele.uuid}>
                    <TableCell className="font-medium flex gap-2">
                      <FaEdit onClick={() => {
                        setDisc(ele)
                        setActionView('Edit')
                      }} />
                      <FaTrashAlt onClick={() => {
                        setUuid(ele.uuid)
                        setAlert(true)
                      }} />
                    </TableCell>
                    <TableCell>{ele.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell>{discs.length} Disciplinas Cadastradas</TableCell>
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
            <p className='text-center p-4'>Realmente deseja excluir esta disciplina?</p>
          </EstModal>
        </>
      ) : (
        <>
          {disc && <ModEditDisc form={disc} setView={setActionView} reset={handleDiscs} /> }
        </>
      )}
      
    </>
  )
}

export default ViewListDisc