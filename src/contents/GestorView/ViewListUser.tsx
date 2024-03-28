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
import { dataUser, propsView } from '@/interface'
import { FaEdit, FaTrashAlt } from "react-icons/fa"
import ModEditUser from './ModEditUser'
import { EstModal } from '@/components'

const ViewListUser = (props: propsView) => {

  const [usuarios, setUsuarios] = React.useState<dataUser[]>([])
  const [usuario, setUsuario] = React.useState<dataUser>()
  const [actionView, setActionView] = React.useState<string>('Listar')
  const [alert, setAlert] = React.useState<boolean>(false)
  const [uuid, setUuid] = React.useState<string>('')

  const handleUsuarios = async () => {
  try {
    const response = await api.get('/usuario', { params: { all: true }})
    const users: dataUser[] = response.data
    if (response) {
      setUsuarios(users.filter(item => item.access_level <= 5))
    }
  } catch (error) {
    console.log(error)
  }
  }

  React.useEffect(()=> {
    handleUsuarios()
  }, [])

  const deleteAction = async () => {
    try {
      await api.delete('/usuario', { params: { uuid: uuid }})
      handleUsuarios()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {actionView === 'Listar' ? (
        <>
          <h1 className='text-lg w-full px-2'>Listar Usuários</h1>
          <div className='flex flex-wrap p-2 w-full'>
          {usuarios.length === 0 ? (
            <p className='text-center w-full'>Aguarde alguns instantes...</p>
          ) : (
            <Table>
              <TableCaption>Lista de Usuários.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Ações</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map((ele) => (
                  <TableRow key={ele.uuid}>
                    <TableCell className="font-medium flex gap-2">
                      <FaEdit onClick={() => {
                        setUsuario(ele)
                        setActionView('Edit')
                      }} />
                      <FaTrashAlt onClick={() => {
                        setUuid(ele.uuid)
                        setAlert(true)
                      }} />
                    </TableCell>
                    <TableCell>{ele.nome}</TableCell>
                    <TableCell>{ele.cpf}</TableCell>
                    <TableCell>{ele.email}</TableCell>
                    <TableCell>{ele.papel_name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell>{usuarios.length} Usuários Cadastrados</TableCell>
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
            <p className='text-center p-4'>Realmente deseja excluir este usuário?</p>
          </EstModal>
        </>
      ) : (
        <>
          {usuario && <ModEditUser form={usuario} setView={setActionView} reset={handleUsuarios} /> }
        </>
      )}
      
    </>
  )
}

export default ViewListUser