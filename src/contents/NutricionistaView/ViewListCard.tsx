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
import { dataCardapio, propsView } from '@/interface'
import { FaEdit, FaTrashAlt } from "react-icons/fa"
import ModEditCard from './ModEditCard'
import { EstModal } from '@/components'

const ViewListCard = (props: propsView) => {

  const [cardapios, setCardapios] = React.useState<dataCardapio[]>([])
  const [cardapio, setCardapio] = React.useState<dataCardapio>()
  const [actionView, setActionView] = React.useState<string>('Listar')
  const [alert, setAlert] = React.useState<boolean>(false)
  const [uuid, setUuid] = React.useState<string>('')

  const handleCardapios = async () => {
  try {
    const response = await api.get('/cardapio', { params: { all: true }})
    if (response) {
      setCardapios(response.data)
    }
  } catch (error) {
    console.log(error)
  }
  }

  React.useEffect(()=> {
    handleCardapios()
  }, [])

  const deleteAction = async () => {
    try {
      await api.delete('/cardapio', { params: { uuid: uuid }})
      handleCardapios()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {actionView === 'Listar' ? (
        <>
          <h1 className='text-lg w-full px-2'>Listar Cardápios</h1>
          <div className='flex flex-wrap p-2 w-full'>
          {cardapios.length === 0 ? (
            <p className='text-center w-full'>Aguarde alguns instantes...</p>
          ) : (
            <Table>
              <TableCaption>Lista de Cardápios.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Ações</TableHead>
                  <TableHead>Nome</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cardapios.map((ele) => (
                  <TableRow key={ele.uuid}>
                    <TableCell className="font-medium flex gap-2">
                      <FaEdit onClick={() => {
                        setCardapio(ele)
                        setActionView('Edit')
                      }} />
                      <FaTrashAlt onClick={() => {
                        setUuid(ele.uuid)
                        setAlert(true)
                      }} />
                    </TableCell>
                    <TableCell>{ele.nome}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell>{cardapios.length} Cardápios Cadastrados</TableCell>
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
            <p className='text-center p-4'>Realmente deseja excluir este cardápio?</p>
          </EstModal>
        </>
      ) : (
        <>
          {cardapio && <ModEditCard form={cardapio} setView={setActionView} reset={handleCardapios} /> }
        </>
      )}
      
    </>
  )
}

export default ViewListCard