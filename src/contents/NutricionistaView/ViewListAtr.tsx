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
import { dataCardEsc, propsView } from '@/interface'
import { FaEdit, FaTrashAlt } from "react-icons/fa"
import ModEditAtr from './ModEditAtr'
import { EstModal } from '@/components'

const ViewListAtr = (props: propsView) => {

  const [cardEscs, setCardEscs] = React.useState<dataCardEsc[]>([])
  const [cardEsc, setCardEsc] = React.useState<dataCardEsc>()
  const [actionView, setActionView] = React.useState<string>('Listar')
  const [alert, setAlert] = React.useState<boolean>(false)
  const [uuid, setUuid] = React.useState<string>('')

  const handleCadEscs = async () => {
  try {
    const response = await api.get('/cardapio-escola', { params: { all: true }})
    if (response) {
      setCardEscs(response.data)
    }
  } catch (error) {
    console.log(error)
  }
  }

  React.useEffect(()=> {
    handleCadEscs()
  }, [])

  const deleteAction = async () => {
    try {
      await api.delete('/cardapio-escola', { params: { uuid: uuid }})
      handleCadEscs()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {actionView === 'Listar' ? (
        <>
          <h1 className='text-lg w-full px-2'>Listar Cardápios Atribuídos</h1>
          <div className='flex flex-wrap p-2 w-full'>
          {cardEscs.length === 0 ? (
            <p className='text-center w-full'>Aguarde alguns instantes...</p>
          ) : (
            <Table>
              <TableCaption>Lista de Cardápios Atribuídos.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Ações</TableHead>
                  <TableHead>Cardápio</TableHead>
                  <TableHead>Dia da Semana</TableHead>
                  <TableHead>Turno</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cardEscs.map((ele) => (
                  <TableRow key={ele.uuid}>
                    <TableCell className="font-medium flex gap-2">
                      <FaEdit onClick={() => {
                        setCardEsc(ele)
                        setActionView('Edit')
                      }} />
                      <FaTrashAlt onClick={() => {
                        setUuid(ele.uuid)
                        setAlert(true)
                      }} />
                    </TableCell>
                    <TableCell>{ele.cardapio_name}</TableCell>
                    <TableCell>{ele.dia_da_semana}</TableCell>
                    <TableCell>{ele.turno}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell>{cardEscs.length} Cardápios Atriuídos</TableCell>
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
            <p className='text-center p-4'>Realmente deseja excluir esta atribuição?</p>
          </EstModal>
        </>
      ) : (
        <>
          {cardEsc && <ModEditAtr form={cardEsc} setView={setActionView} reset={handleCadEscs} /> }
        </>
      )}
      
    </>
  )
}

export default ViewListAtr