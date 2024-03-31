import React from 'react'; // Importação do React
import { // Importação dos componentes de tabela
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from '@/service/api'; // Importação do serviço de API
import { // Importação das interfaces necessárias
  cadAlunoTurma,
  dataAluno,
  dataFrequencia,
  dataSala,
  dataTurma,
  dataUser,
  horario,
  propSelect,
  propsView,
} from '@/interface';
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Importação de ícones
import { // Importação de componentes personalizados
  EleAlert,
  EleButton,
  EleInput,
  EstContainer,
  EstModal,
} from '@/components';
import { IoMdTime } from 'react-icons/io'; // Importação de ícones

const ViewRelatorio = (props: propsView) => { // Declaração do componente funcional ViewRelatorio

  // Declaração de estados
  const [conf, setConf] = React.useState<boolean>(false); // Estado para controle de exibição da confirmação de exclusão
  const [turmas, setTurmas] = React.useState<dataTurma[]>([]); // Estado para armazenar as turmas
  const [turma, setTurma] = React.useState<dataTurma>({ // Estado para armazenar os dados da turma selecionada
    created_at: '',
    disciplina: '',
    horario: '',
    nome_professor: '',
    sala: '',
    updated_at: '',
    uuid:  ''
  });
  const [salas, setSalas] = React.useState<propSelect[]>([]); // Estado para armazenar as salas
  const [sala, setSala] = React.useState<string>(''); // Estado para armazenar a sala selecionada
  const [actionView, setActionView] = React.useState<string>('Listar'); // Estado para controle de visualização de ação
  const [alert, setAlert] = React.useState<boolean>(false); // Estado para controle de exibição de alerta
  const [uuid, setUuid] = React.useState<string>(''); // Estado para armazenar o UUID

  const [alunoTurma, setAlunoTurma] = React.useState<cadAlunoTurma[]>([]); // Estado para armazenar os alunos da turma
  const [aluno, setAluno] = React.useState<cadAlunoTurma>({ // Estado para armazenar os dados do aluno selecionado
    aluno_uuid: '',
    created_at: '',
    turma_name: '',
    turma_uuid: '',
    updated_at: '',
    uuid: ''
  });
  const [frequencias, setFrequencias] = React.useState<dataFrequencia[]>([]); // Estado para armazenar as frequências dos alunos
  const [alunos, setAlunos] = React.useState<dataAluno[]>([]); // Estado para armazenar os dados dos alunos
  const [load, setLoad] = React.useState<boolean>(false); // Estado para controle de exibição do carregamento
  const [detail, setDetail] = React.useState<boolean>(false); // Estado para controle de exibição do detalhe de presença

  const [alert2, setAlert2] = React.useState<boolean>(false); // Estado para controle de exibição de alerta 2
  const [exit, setExit] = React.useState<boolean>(false); // Estado para controle de saída do alerta
  const [message, setMessage] = React.useState<string>(''); // Estado para mensagem do alerta

  // Função para buscar as turmas do professor
  const handleTurmas = async () => {
    try {
      const response = await api.get('/aluno-turmas', { params: { all: true , attribute : "turma_uuid", value: turma.uuid } } )
      setAlunoTurma(response.data)
    } catch (err) {
      console.log(err)
    }
  }

  // Função para buscar as salas da escola
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

  // Função para buscar as frequências do aluno
  const handleAluno = async () => {
    try {
      const response = await api.get('/frequencias', { params: { all: true, attribute: 'aluno_turmas_uuid', value: aluno.uuid }})
      setFrequencias(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  // Efeito para buscar as salas ao montar o componente
  React.useEffect(()=> {
    handleSalas()
  }, [])

  // Efeito para buscar as turmas ao selecionar uma sala
  React.useEffect(() => {
    handleTurmas()
  }, [turma])

  // Efeito para buscar as frequências ao selecionar um aluno
  React.useEffect(() => {
    handleAluno()
  }, [aluno])

  // Função para lidar com a seleção de uma sala
  const handleSelect = async (value: string, label: string) => {
    setSala(value)
    const dataUser = localStorage.getItem('@aplication/aoponto')
    if (dataUser) {
      const tempUser = JSON.parse(dataUser)
      try {
        const response = await api.get('/turmas', { params: { all: true, attribute: 'sala', value: value }})
        setTurmas(response.data.filter((item:dataTurma) => item.nome_professor === tempUser.user.nome))
      } catch (error) {
        console.log(error)
      }
    }
  }

  // Função para resetar a seleção da sala
  const handleReset = async () => {
    try {
      const response = await api.get('/turmas', { params: { all: true, attribute: 'sala', value: sala }})
      setTurmas(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  // Função para realizar a exclusão de uma turma
  const deleteAction = async () => {
    try {
      await api.delete('/turmas', { params: { uuid: uuid }})
      handleReset()
    } catch (error) {
      console.log(error)
    }
  }

  // Função para salvar as alterações nas frequências
  const handleSave = async () => {
    try{
      frequencias.map(async (item) => {
        await api.put('/frequencias', item, { params: { uuid:  item.uuid }} )
      })
      setMessage('Alterações Salvas!')
      setAlert2(true)
    } catch (error) {
      console.log(error)
      setMessage('Erro no servidor, tente novamente')
      setAlert2(true)
    }
  }

  // Função para controlar a ação do alerta
  const alertAction = () => {
    setAlert2(false)
    setDetail(false)
  }

  return (
    <>
      {actionView === 'Listar' ? (
        <>
          <h1 className='text-lg w-full px-2'>Relatório de Presença</h1>
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
                  <TableHead>Ações</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Presença</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {frequencias.map((item) => (
                  <TableRow key={item.uuid}>
                    <TableCell><button onClick={() => {
                      const array = frequencias.map((i) => {
                        if(i.uuid === item.uuid) {
                          return {...i, chamada: !i.chamada}
                        } else {
                          return i
                        }
                      })
                      setFrequencias(array)
                    }} >Alterar</button></TableCell>
                    <TableCell>{item.data}</TableCell>
                    <TableCell>{item.hora}:00</TableCell>
                    <TableCell>{item.chamada ? "Presente" : "Ausente"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <EleButton onClick={()=> setDetail(false)}>Voltar</EleButton>
            <EleButton onClick={() => handleSave()}>Salvar Alterações</EleButton>
          </EstContainer>
        </div>
      )}
      <EleAlert 
        message={message}
        open={alert2}
        setAlert={alertAction}/>
    </>
  )
}

export default ViewRelatorio; // Exportação do componente ViewRelatorio
