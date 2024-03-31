// Importações de componentes personalizados para UI, interfaces para tipos de dados, API para requisições ao servidor, e outras bibliotecas/utilitários.
import { EleAlert, EleButton, EleInput } from '@/components'
import { cadAlunoTurma, dataTurma, papelRequest, propSelect, propsView } from '@/interface'
import { formatDate } from '@/lib/utils'
import api from '@/service/api'
import React from 'react'
import { IoMdTime } from 'react-icons/io' // Ícone de relógio utilizado para indicar carregamento.
import uuid from 'react-uuid' // Geração de UUIDs únicos para novas entradas.

// Definição do componente com propriedades esperadas.
const ViewComporTurma = (props: propsView) => {
  const date = new Date // Data atual, usada para marcação de criação/edição.

  // Estados gerenciados pelo componente.
  const [salas, setSalas] = React.useState<propSelect[]>([]) // Lista de salas disponíveis.
  const [sala, setSala] = React.useState<string>('') // Sala selecionada.
  const [alunos, setAlunos] = React.useState<propSelect[]>([]) // Lista de alunos disponíveis para atribuição.
  const [aluno, setAluno] = React.useState<string>('') // Aluno selecionado.
  const [listaAlunos, setListaAlunos] = React.useState<propSelect[]>([]) // Lista de alunos atribuídos à sala selecionada.
  const [turmas, setTurmas] = React.useState<dataTurma[]>([]) // Lista de turmas relacionadas à sala.

  // Estados para controle de alertas e ações de usuário.
  const [alert, setAlert] = React.useState<boolean>(false) // Exibição de alerta.
  const [message, setMessage] = React.useState<string>('') // Mensagem do alerta.
  const [exit, setExit] = React.useState<boolean>(false) // Controle para saída/redirecionamento.
  const [load, setLoad] = React.useState<boolean>(false) // Estado de carregamento.

  // Função para atualizar a sala selecionada e buscar turmas correspondentes.
  const handleChangeSala = async (value: string, label: string) => {
    setSala(value)
    try {
      const response = await api.get('/turmas', {params: { all: true, attribute: 'sala', value: value}})
      setTurmas(response.data)
    } catch(err) {
      console.log(err)
    }
  }

  // Função para adicionar alunos à lista de atribuição para a sala selecionada.
  const handleChangeAlunos = (value: string, label: string) => {
    if (value !== ''){
      setAluno(value)
      const todosAlunos = listaAlunos
      const addAluno = alunos.find(item => item.uuid === value)
      if(addAluno) {
        !todosAlunos.some(item => item === addAluno) && todosAlunos.push(addAluno)
        setListaAlunos(todosAlunos)
      }
    }
  }

  // Função para inicializar o componente com dados necessários.
  const handleGet = async () => {
    const dataUser = localStorage.getItem('@aplication/aoponto')
    if (dataUser) {
      const tempUser = JSON.parse(dataUser)
      try {
        let response = await api.get('/salas', { params: { all: true, attribute: 'escola_uuid', value: tempUser.user.escola_uuid }})
        let temp = response.data.map((item: { uuid: any; nome: any }) => {
          return { uuid: item.uuid, name: item.nome }
        })
        setSalas(temp)
        response = await api.get('alunos', { params: { all: true, attribute: 'escola_uuid', value: tempUser.user.escola_uuid }})
        temp = response.data.map((item: { uuid: any; nome: any }) => {
          return { uuid: item.uuid, name: item.nome }
        })
        setAlunos(temp)
      } catch(error) {
        console.log(error)
      }
    }
  }

  // Função para lidar com a ação do alerta, permitindo fechá-lo e possivelmente redirecionar o usuário.
  const alertAction = () => {
    if(exit) {
      setAlert(false)
      props.setView('Listar')
    } else {
      setAlert(false)
    }
  }

  // Função para submeter a atribuição de alunos às turmas selecionadas.
  const handleSubmit = async () => {
    setLoad(true)
    turmas.map(async (i) => {
      try {
        const requisit = await api.get('/aluno-turmas', { params: { all: true, attribute: 'turma_uuid', value: i.uuid }})
        if (requisit.data.length !== 0) {
          setMessage(`Erro ao cadastrar alunos na disciplina '${i.disciplina} desta turma'!`)
          setAlert(true)
        } else {
          if(sala === '' || aluno === '') {
            setMessage('Preencha todos os campos corretamente')
            setAlert(true)
          } else {
            listaAlunos.map(async item => {
              const upForm:cadAlunoTurma = {
                aluno_uuid: item.uuid,
                created_at: formatDate(date),
                turma_name: salas.find(item => item.uuid === i.sala)?.name + ' - ' + i.disciplina,
                turma_uuid: i.uuid,
                updated_at: '',
                uuid: uuid()
              }
              try {
                await api.post('/aluno-turmas', upForm)
              } catch(err) {
                console.log(err)
              }
            })
          }
        }
      } catch (error) {
        console.log(error)
      }
    })
    setLoad(false)
    setMessage('Atribuições realizadas com sucesso!')
    setAlert(true)
    setExit(true)
  }

  // Efeito para carregar dados no montar do componente.
  React.useEffect(() => {
    handleGet()
  }, [])

  // Renderização do componente, incluindo os inputs, lista de alunos atribuídos e botões de ação.
  return (
    <>
      <h1 className='text-lg w-full px-2'>Compor Turmas</h1>
      <div className='flex flex-wrap gap-x-4 p-2 w-full'>
        {/* Seletores para sala e alunos, e visualização dos alunos atribuídos */}
        <EleInput label='Série' type='select' data={salas} name='sala' value={sala} onChange={handleChangeSala}/>
        <div className='flex flex-wrap w-full'>
          {listaAlunos.map((item) => (
            <div className='w-1/3 p-2 border-b' key={item.uuid}>{item.name}</div>
          ))}
        </div>
        <EleInput label='Alunos' type='select' data={alunos} name='ano' value={aluno} onChange={handleChangeAlunos}/>
      </div>
      <EleButton onClick={handleSubmit}>Compor Turmas</EleButton>
      <EleAlert message={message} open={alert} setAlert={alertAction}/>
      {/* Indicador de carregamento */}
      {load && (
        <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-[calc(100%-20px)] sm:w-1/2 md:w-1/3 lg:w-1/4 rounded-lg bg-white p-12 text-center">
            <IoMdTime size={60} className='m-auto mb-5' />
            Aguarde
          </div>
        </div>
      )}
    </>
  )
}

export default ViewComporTurma
