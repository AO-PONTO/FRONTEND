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
import { cadAlunoTurma, dataAluno, dataFrequencia, dataSala, dataTurma, dataUser, horario, propSelect, propsView } from '@/interface'
import { FaEdit, FaTrashAlt } from "react-icons/fa"
import { EleButton, EleInput, EstContainer, EstModal } from '@/components'
import ModEditTurma from './ModEditTurma'
import { IoMdTime } from 'react-icons/io'

const ViewListComporTurma = (props: propsView) => {

  const [conf, setConf] = React.useState<boolean>(false)

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

  const [alunoTurma, setAlunoTurma] = React.useState<cadAlunoTurma[]>([])
  const [aluno, setAluno] = React.useState<cadAlunoTurma>({
    aluno_uuid: '',
    created_at: '',
    turma_name: '',
    turma_uuid: '',
    updated_at: '',
    uuid: ''
  })
  const [frequencias, setFrequencias] = React.useState<dataFrequencia[]>([])
  const [alunos, setAlunos] = React.useState<dataAluno[]>([])
  const [load, setLoad] = React.useState<boolean>(false)
  const [detail, setDetail] = React.useState<boolean>(false)

  const handleTurmas = async () => {
    try {
      const response = await api.get('/aluno-turmas', { params: { all: true , attribute : "turma_uuid", value: turma.uuid } } )
      setAlunoTurma(response.data)
    } catch (err) {
      console.log(err)
    }
  }

  const handleSalas = async () => {
    const dataUser = localStorage.getItem('@aplication/aoponto')
    if (dataUser) {
      const tempUser = JSON.parse(dataUser)
      try {
        let response = await api.get('/salas', { params: { all: true , attribute : "escola_uuid", value: tempUser.user.escola_uuid } })
        if (response) {
          const tempResp = response.data.map((item: { nome: any; uuid: any }) => {
            return {
              name: item.nome,
              uuid: item.uuid
            }
          })
          setSalas(tempResp)
          response = await api.get('/alunos', { params: { all: true , attribute : "escola_uuid", value: tempUser.user.escola_uuid } })
          if (response) {
            setAlunos(response.data)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
  const handleAluno = async () => {
    try {
      const response = await api.get('/frequencias', { params: { all: true, attribute: 'aluno_turmas_uuid', value: aluno.uuid }})
      setFrequencias(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(()=> {
    handleSalas()
  }, [])

  React.useEffect(() => {
    handleTurmas()
  }, [turma])

  React.useEffect(() => {
    handleAluno()
  }, [aluno])


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
  
  const handleDeleteTurma = async () => {
    setLoad(true)
    turmas.map(async ele => {
      try {
        const response = await api.get('/aluno-turmas', { params: { all: true , attribute : "turma_uuid", value: ele.uuid } } )
        response.data.map(async (item: { uuid: any }) => {
          try {
            await api.delete('/aluno-turmas', { params: { uuid: item.uuid }})
          } catch (error) {
            console.log(error)
          }
        })
      } catch (err) {
        console.log(err)
      }
    })
    setConf(false)
    handleTurmas()
    setLoad(false)
    setSala('')
    setTurmas([])
  }

  return (
    <>
      {actionView === 'Listar' ? (
        <>
          <h1 className='text-lg w-full px-2'>Listar Alunos da Turma</h1>
          <EleInput label='Série' name='serie' type='select' data={salas} value={sala} onChange={handleSelect} />
          <div className='flex flex-wrap p-2 w-full'>
          {turmas.length === 0 ? (
            <p className='text-center w-full'>Selecione uma Turma</p>
          ) : (
            <>
            {conf ? (
              <>
              <Table>
                <TableCaption>Lista de Alunos na Turma {salas.find(item => item.uuid === turma.sala)?.name} - {turma.disciplina}.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Disciplina</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alunoTurma.map((ele) => (
                    <TableRow key={ele.uuid}>
                      <TableCell>
                        <button onClick={() => {
                          setDetail(true)
                          setAluno(ele)
                        }}>Ver Presenças</button>
                      </TableCell>
                      <TableCell>{alunos.find(item => item.uuid === ele.aluno_uuid)?.nome}</TableCell>
                      <TableCell>{ele.turma_name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <EleButton onClick={()=> setConf(false)}>Voltar</EleButton>
              </>
            ) : (
              <>
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
                        <button onClick={() => {
                          setTurma(ele)
                          setConf(true)
                        }}>Conferir</button>
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
              <EleButton onClick={handleDeleteTurma}>Esvaziar turma</EleButton>
              </>
            )}
            </>
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
      {load && (
        <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-[calc(100%-20px)] sm:w-1/2 md:w-1/3 lg:w-1/4 rounded-lg bg-white p-12 text-center">
            <IoMdTime size={60} className='m-auto mb-5' />
            Aguarde
          </div>
        </div>
      )}
      {detail && (
        <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 z-50">
          <EstContainer size='big' shadow='center' rounded='medium' scroll>
            <Table>
              <TableCaption>Presenças de {alunos.find(item => item.uuid === aluno.aluno_uuid)?.nome}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Presença</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {frequencias.map((item) => (
                  <TableRow key={item.uuid}>
                    <TableCell>{item.data}</TableCell>
                    <TableCell>{item.hora}:00</TableCell>
                    <TableCell>{item.chamada ? "Presente" : "Ausente"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <EleButton onClick={()=> setDetail(false)}>Voltar</EleButton>
          </EstContainer>
        </div>
      )}
    </>
  )
}

export default ViewListComporTurma