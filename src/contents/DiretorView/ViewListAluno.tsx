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
import { dataAluno, propsView } from '@/interface'
import { FaEdit, FaTrashAlt } from "react-icons/fa"
import { EstModal } from '@/components'
import ModEditAluno from './ModEditAluno'

const ViewListAluno = (props: propsView) => {

  const [alunos, setAlunos] = React.useState<dataAluno[]>([])
  const [aluno, setAluno] = React.useState<dataAluno>()
  const [actionView, setActionView] = React.useState<string>('Listar')
  const [alert, setAlert] = React.useState<boolean>(false)
  const [uuid, setUuid] = React.useState<string>('')

  const handleAlunos = async () => {
    const dataUser = localStorage.getItem('@aplication/aoponto')
    if (dataUser) {
      const tempUser = JSON.parse(dataUser)
      try {
        const response = await api.get('/alunos', { params: { all: true , attribute : "escola_uuid", value: tempUser.user.escola_uuid } })
        if (response) {
          setAlunos(response.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  React.useEffect(()=> {
    handleAlunos()
  }, [])

  const deleteAction = async () => {
    try {
      await api.delete('/alunos', { params: { uuid: uuid }})
      handleAlunos()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {actionView === 'Listar' ? (
        <>
          <h1 className='text-lg w-full px-2'>Listar Alunos</h1>
          <div className='flex flex-wrap p-2 w-full'>
          {alunos.length === 0 ? (
            <p className='text-center w-full'>Aguarde alguns instantes...</p>
          ) : (
            <Table>
              <TableCaption>Lista de Alunos.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Ações</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Data de Nascimento</TableHead>
                  <TableHead>Matrícula</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alunos.map((ele) => (
                  <TableRow key={ele.uuid}>
                    <TableCell className="font-medium flex gap-2">
                      <FaEdit onClick={() => {
                        setAluno(ele)
                        setActionView('Edit')
                      }} />
                      <FaTrashAlt onClick={() => {
                        setUuid(ele.uuid)
                        setAlert(true)
                      }} />
                    </TableCell>
                    <TableCell>{ele.nome}</TableCell>
                    <TableCell>{ele.data_nascimento}</TableCell>
                    <TableCell>{ele.matricula}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell>{alunos.length} Alunos Cadastrados</TableCell>
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
            <p className='text-center p-4'>Realmente deseja excluir este aluno?</p>
          </EstModal>
        </>
      ) : (
        <>
          {aluno && <ModEditAluno form={aluno} setView={setActionView} reset={handleAlunos} /> }
        </>
      )}
      
    </>
  )
}

export default ViewListAluno