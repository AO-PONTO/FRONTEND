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
} from "@/components/ui/table" // Importações de componentes de tabela personalizados
import api from '@/service/api' // Importação do módulo de API personalizado
import { cadAlunoTurma, dataAluno, dataFrequencia, dataTurma, propSelect, propsView } from '@/interface' // Importações de tipos de dados personalizados
import { EleButton, EleInput, EstContainer, EstModal } from '@/components' // Importações de outros componentes personalizados
import ModEditTurma from './ModEditTurma' // Importação do componente de edição de turma
import { IoMdTime } from 'react-icons/io' // Importação de um ícone do React

const ViewListComporTurma = (props: propsView) => { // Declaração do componente funcional ViewListComporTurma com props de tipo propsView

  const [conf, setConf] = React.useState<boolean>(false) // Estado para controlar a exibição do modal de confirmação
  const [turmas, setTurmas] = React.useState<dataTurma[]>([]) // Estado para armazenar as turmas
  const [turma, setTurma] = React.useState<dataTurma>({ // Estado para armazenar uma única turma
    created_at: '',
    disciplina: '',
    horario: '',
    nome_professor: '',
    sala: '',
    updated_at: '',
    uuid:  ''
  })
  const [salas, setSalas] = React.useState<propSelect[]>([]) // Estado para armazenar as salas
  const [sala, setSala] = React.useState<string>('') // Estado para armazenar a sala selecionada
  const [actionView, setActionView] = React.useState<string>('Listar') // Estado para controlar a visualização atual (Listar ou Editar)
  const [alert, setAlert] = React.useState<boolean>(false) // Estado para controlar a exibição do modal de alerta
  const [uuid, setUuid] = React.useState<string>('') // Estado para armazenar o UUID de uma turma selecionada

  const [alunoTurma, setAlunoTurma] = React.useState<cadAlunoTurma[]>([]) // Estado para armazenar a relação entre aluno e turma
  const [aluno, setAluno] = React.useState<cadAlunoTurma>({ // Estado para armazenar informações de um aluno específico
    aluno_uuid: '',
    created_at: '',
    turma_name: '',
    turma_uuid: '',
    updated_at: '',
    uuid: ''
  })
  const [frequencias, setFrequencias] = React.useState<dataFrequencia[]>([]) // Estado para armazenar as frequências dos alunos
  const [alunos, setAlunos] = React.useState<dataAluno[]>([]) // Estado para armazenar os dados dos alunos
  const [load, setLoad] = React.useState<boolean>(false) // Estado para controlar o feedback de carregamento
  const [detail, setDetail] = React.useState<boolean>(false) // Estado para controlar a exibição dos detalhes de presença do aluno

    // Função para buscar as turmas correspondentes à sala selecionada
  const handleTurmas = async () => {
    try {
      const response = await api.get('/aluno-turmas', { params: { all: true , attribute : "turma_uuid", value: turma.uuid } } )
      setAlunoTurma(response.data)
    } catch (err) {
      console.log(err)
    }
  }

    // Função para buscar as salas disponíveis
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

    // Função para buscar as presenças de um aluno específico
  const handleAluno = async () => {
    try {
      const response = await api.get('/frequencias', { params: { all: true, attribute: 'aluno_turmas_uuid', value: aluno.uuid }})
      setFrequencias(response.data)
    } catch (error) {
      console.log(error)
    }
  }

    // Efeito para buscar as salas disponíveis ao montar o componente
    React.useEffect(()=> {
      handleSalas()
    }, [])

    // Efeito para buscar as turmas correspondentes à sala selecionada
    React.useEffect(() => {
      handleTurmas()
    }, [turma])

    // Efeito para buscar as presenças do aluno selecionado
    React.useEffect(() => {
      handleAluno()
    }, [aluno])

  // Função para lidar com a seleção de uma sala
  const handleSelect = async (value: string, label: string) => {
    setSala(value)
    try {
      const response = await api.get('/turmas', { params: { all: true, attribute: 'sala', value: value }})
      setTurmas(response.data)
    } catch (error) {
      console.log(error)
    }
  }

    // Função para resetar as turmas ao selecionar uma nova sala
  const handleReset = async () => {
    try {
      const response = await api.get('/turmas', { params: { all: true, attribute: 'sala', value: sala }})
      setTurmas(response.data)
    } catch (error) {
      console.log(error)
    }
  }

    // Função para excluir uma turma
  const deleteAction = async () => {
    try {
      await api.delete('/turmas', { params: { uuid: uuid }})
      handleReset()
    } catch (error) {
      console.log(error)
    }
  }
  
    // Função para deletar todas as turmas de uma sala
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
      {actionView === 'Listar' ? ( // Condição para renderizar a visualização de listagem de turmas
        <>
          <h1 className='text-lg w-full px-2'>Listar Alunos da Turma</h1>
          <EleInput label='Série' name='serie' type='select' data={salas} value={sala} onChange={handleSelect} /> {/* Componente de entrada para selecionar uma sala */}
          <div className='flex flex-wrap p-2 w-full'>
          {turmas.length === 0 ? ( // Condição para renderizar uma mensagem se não houver turmas disponíveis
            <p className='text-center w-full'>Selecione uma Turma</p>
          ) : (
            <>
            {conf ? ( // Condição para renderizar a lista de alunos em uma turma específica ou a lista de turmas disponíveis
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
              <EleButton onClick={()=> setConf(false)}>Voltar</EleButton> {/* Botão para voltar à lista de turmas */}
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
                        }}>Conferir</button> {/* Botão para conferir os alunos em uma turma */}
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
              <EleButton onClick={handleDeleteTurma}>Esvaziar turma</EleButton> {/* Botão para esvaziar todas as turmas da sala */}
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
          {sala && // Condição para renderizar o componente de edição de turma se uma sala estiver selecionada
            <ModEditTurma 
              form={turma} 
              setView={setActionView} 
              reset={handleReset} 
            /> 
          }
        </>
      )}
      {load && ( // Condição para exibir um indicador de carregamento
        <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-[calc(100%-20px)] sm:w-1/2 md:w-1/3 lg:w-1/4 rounded-lg bg-white p-12 text-center">
            <IoMdTime size={60} className='m-auto mb-5' />
            Aguarde
          </div>
        </div>
      )}
      {detail && ( // Condição para exibir os detalhes de presença do aluno
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
            <EleButton onClick={()=> setDetail(false)}>Voltar</EleButton> {/* Botão para voltar à lista de turmas */}
          </EstContainer>
        </div>
      )}
    </>
  )
}

export default ViewListComporTurma