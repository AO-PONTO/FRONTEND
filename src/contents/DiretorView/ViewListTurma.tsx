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
import { dataSala, dataTurma, dataUser, horario, propSelect, propsView } from '@/interface'
import { FaEdit, FaTrashAlt } from "react-icons/fa"
import { EleInput, EstModal } from '@/components'
import ModEditTurma from './ModEditTurma'

const ViewListTurma = (props: propsView) => {

  const [turmas, setTurmas] = React.useState<dataTurma[]>([])
  const [turma, setTurma] = React.useState<dataTurma>({
    created_at: '',
    disciplina: '',
    horario: '',
    nome_professor: '',
    sala: '',
    updated_at: '',
    uuid:  ''
  })
  const [salas, setSalas] = React.useState<propSelect[]>([])
  const [sala, setSala] = React.useState<string>('')
  const [actionView, setActionView] = React.useState<string>('Listar')
  const [alert, setAlert] = React.useState<boolean>(false)
  const [uuid, setUuid] = React.useState<string>('')
  const [horariosTurma, setHorariosTurma] = React.useState<horario[]>([])

  const handleSalas = async () => {
    const dataUser = localStorage.getItem('@aplication/aoponto')
    if (dataUser) {
      const tempUser = JSON.parse(dataUser)
      try {
        const response = await api.get('/salas', { params: { all: true , attribute : "escola_uuid", value: tempUser.user.escola_uuid } })
        if (response) {
          const tempResp = response.data.map((item: { nome: any; uuid: any }) => {
            return {
              name: item.nome,
              uuid: item.uuid
            }
          })
          setSalas(tempResp)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  React.useEffect(()=> {
    handleSalas()
  }, [])


  const handleSelect = async (value: string, label: string) => {
    setSala(value)
    try {
      const response = await api.get('/turmas', { params: { all: true, attribute: 'sala', value: value }})
      setTurmas(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleReset = async () => {
    try {
      const response = await api.get('/turmas', { params: { all: true, attribute: 'sala', value: sala }})
      setTurmas(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const deleteAction = async () => {
    try {
      await api.delete('/turmas', { params: { uuid: uuid }})
      handleReset()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {actionView === 'Listar' ? (
        <>
          <h1 className='text-lg w-full px-2'>Listar Turmas</h1>
          <EleInput label='Série' name='serie' type='select' data={salas} value={sala} onChange={handleSelect} />
          <div className='flex flex-wrap p-2 w-full'>
          {turmas.length === 0 ? (
            <p className='text-center w-full'>Selecione uma Turma</p>
          ) : (
            <Table>
              <TableCaption>Lista de Turmas.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Ações</TableHead>
                  <TableHead>Série</TableHead>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Professor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {turmas.map((ele) => (
                  <TableRow key={ele.uuid}>
                    <TableCell className="font-medium flex gap-2">
                      <FaEdit onClick={() => {
                        setTurma(ele)
                        setActionView('Edit')
                        setHorariosTurma(JSON.parse(ele.horario.replace(/'/g, '"')))
                      }} />
                      <FaTrashAlt onClick={() => {
                        setUuid(ele.uuid)
                        setAlert(true)
                      }} />
                    </TableCell>
                    <TableCell>{salas.find(item => item.uuid === ele.sala)?.name}</TableCell>
                    <TableCell>{ele.disciplina}</TableCell>
                    <TableCell>{ele.nome_professor}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell>{turmas.length} turmas Cadastradas</TableCell>
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
            <p className='text-center p-4'>Realmente deseja excluir esta sala?</p>
          </EstModal>
        </>
      ) : (
        <>
          {sala && 
            <ModEditTurma 
              form={turma} 
              setView={setActionView} 
              reset={handleReset} 
            /> 
          }
        </>
      )}
      
    </>
  )
}

export default ViewListTurma