// Importações dos componentes, interfaces, API e utilitários necessários.
import { EleButton, EleInput, EleAlert } from '@/components' // Componentes de UI personalizados
import { cadTurma, dataSala, dataTurma, dataUser, horario, propSelect } from '@/interface' // Tipos e interfaces
import api from '@/service/api' // Serviço de API para comunicação com o backend
import React from 'react' // Importa React para criação de componentes e gestão de estado
// Componentes de tabela e ícone de lixeira para uso na interface de usuário
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FaTrashAlt } from 'react-icons/fa' // Ícone de lixeira para botão de excluir
// Componentes para visualização e edição de horários de aulas
import TableHorariosEdit from './TableHorariosEdit'

// Define as propriedades esperadas pelo componente ModEditTurma
interface Module {
  form: dataTurma, // Dados da turma para edição
  setView: React.Dispatch<React.SetStateAction<string>>, // Função para alterar a visualização da interface
  reset?: Function // Função opcional para resetar o estado (não usado neste componente)
}

// Componente funcional ModEditTurma para edição de turmas
const ModEditTurma = (props: Module) => {
  // Estados para os dias da semana disponíveis para seleção em horários de aulas
  const diaSemana: propSelect[] = [
    { name: 'segunda', uuid: '1' },
    { name: 'terça', uuid: '2' },
    { name: 'quarta', uuid: '3' },
    { name: 'quinta', uuid: '4' },
    { name: 'sexta', uuid: '5' }
  ]

  const date = new Date // Obtém a data atual para uso no registro de atualização

  // Estados do componente para gerenciar o formulário de edição e dados associados
  const [form, setForm] = React.useState<cadTurma>({...props.form,
    // Converte o horário de string para objeto JSON, corrigindo as aspas simples
    horario: JSON.parse(props.form.horario.replace(/'/g, '"'))
  })
  // Estados para listas de seleção no formulário
  const [disciplinas, setDisciplinas] = React.useState<propSelect[]>([])
  const [salas, setSalas] = React.useState<propSelect[]>([])
  const [dataSalas, setDataSalas] = React.useState<dataSala[]>([])
  const [dataSala, setDataSala] = React.useState<dataSala | undefined>()
  const [professores, setProfessores] = React.useState<propSelect[]>([])
  // Estados para controle de alertas e mensagens
  const [alert, setAlert] = React.useState<boolean>(false)
  const [exit, setExit] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState<string>('')
  // Estados para gerenciamento de horários de aula
  const [horarios, setHorarios] = React.useState<propSelect[]>([])
  const [formHorarios, setFormHorarios] = React.useState<horario[]>(form.horario)
  const [formHorario, setFormHorario] = React.useState<horario>({ dia: '', hora: '' })
  // Estados para controle de reconstrução de componentes
  const [destroy, setDestroy] = React.useState<boolean>(false)
  const [constroi, setConstroi] = React.useState(true)
  const [turmas, setTurmas] = React.useState<cadTurma[]>([])

  // Funções para manipulação de estados específicos no formulário
  const handleChangeForm = (value: string, label: string) => {
    // Atualiza o estado do formulário baseado na entrada do usuário
    setForm((prev) => ({ ...prev, [label]: value }))
  }

  const handleChangeFormHorario = (value: string, label: string) => {
    // Atualiza o estado do horário específico baseado na entrada do usuário
    setFormHorario((prev) => ({ ...prev, [label]: value }))
  }


  // Função para carregar dados iniciais do servidor
  const handleGet = async () => {
    const dataUser = localStorage.getItem('@aplication/aoponto')
    if (dataUser) {
      const tempUser = JSON.parse(dataUser)
      try {
        // Carrega disciplinas disponíveis
        let response = await api.get('/disciplinas', { params: { all: true } })
        if (response) {
          const temp = response.data.map((item: { name: any }) => {
            return {
              uuid: item.name,
              name: item.name
            }
          })
          setDisciplinas(temp)
        }
        // Carrega salas disponíveis filtradas pela escola do usuário
        response = await api.get('/salas', { params: { all: true, attribute: "escola_uuid", value: tempUser.user.escola_uuid } })
        if (response) {
          const temp = response.data.map((item: { nome: any, uuid: any }) => {
            return {
              uuid: item.uuid,
              name: item.nome
            }
          })
          setSalas(temp)
          setDataSalas(response.data)
          // Define a sala atual baseado na sala da turma
          const room = response.data.find((item: { uuid: string }) => item.uuid === form.sala)
          setDataSala(room)
          // Configura os horários disponíveis baseados no turno da sala
          if(room) { 
            if(room?.turno === 'matutino') {
              setHorarios([
                { name: '07:00 - 08:00', uuid: '07' },
                { name: '08:00 - 09:00', uuid: '08' },
                { name: '09:00 - 10:00', uuid: '09' },
                { name: '10:00 - 11:00', uuid: '10' },
              ])
            } else if(room?.turno === 'vespertino') {
              setHorarios([
                { name: '13:00 - 14:00', uuid: '13' },
                { name: '14:00 - 15:00', uuid: '14' },
                { name: '15:00 - 16:00', uuid: '15' },
                { name: '16:00 - 17:00', uuid: '16' },
              ])
            } else if(room?.turno === 'noturno') {
              setHorarios([
                { name: '19:00 - 20:00', uuid: '19' },
                { name: '20:00 - 21:00', uuid: '20' },
                { name: '21:00 - 22:00', uuid: '21' },
                { name: '22:00 - 23:00', uuid: '22' },
              ])
            }
          }
        }
        // Carrega professores disponíveis filtrados pela escola do usuário
        response = await api.get('/usuario', { params: { all: true, attribute: "escola_uuid", value: tempUser.user.escola_uuid } })
        if (response) {
          let tempResponse: dataUser[] = response.data
          tempResponse = tempResponse.filter(item => item.access_level === 2)
          const temp = tempResponse.map(item => {
            return {
              uuid: item.nome,
              name: item.nome
            }
          })
          setProfessores(temp)
        }
      } catch (error) {
        console.log(error) // Log de erro em caso de falha na requisição
      }
    }
  }

  // Função para submissão do formulário de edição da turma
  const handleSubmit = async () => {
    let updatedForm = { ...form,
      horario: JSON.stringify(formHorarios),
      updated_at: date
    }
    // Validação dos campos obrigatórios
    if(updatedForm.disciplina === '' ||
      updatedForm.nome_professor === '' ||
      updatedForm.sala === '' ||
      updatedForm.horario.length === 0 ) {
      setMessage('Preencha todos os campos corretamente')
      setAlert(true)
    } else {
      // Verificação de conflito de horários
      const horariosCadastrados: horario[] = []
      turmas.filter(obj => obj.disciplina !== form.disciplina).map(item => {
        return item.horario.map(i => horariosCadastrados.push(i))
      })
      if(horariosCadastrados.some(obj1 => {
        return formHorarios.some(obj2 => obj1.dia === obj2.dia && obj1.hora === obj2.hora)
      })) {
        setMessage('Horário requisitado já possui turma')
        setAlert(true)
      } else {
        // Tentativa de atualização da turma no servidor
        try {
          await api.put('/turmas/', updatedForm, { params: { uuid: form.uuid }})
          setMessage('Turma editada com sucesso!')
          setExit(true)
          setAlert(true)
        } catch (error) {
          setMessage('Erro no servidor, tente novamente')
          setAlert(true)
          console.log(error) // Log de erro
        }
      }
    }
  }

  // Função chamada ao fechar o alerta
  const alertAction = () => {
    if (exit) {
      setAlert(false)
      props.setView('Listar') // Muda a visualização para a lista de turmas
    } else {
      setAlert(false)
    }
  }

  // Efeito para carregar dados iniciais
  React.useEffect(() => {
    handleGet()
  }, [])

  // Efeito para forçar a reconstrução de componentes relacionados ao estado `destroy`
  React.useEffect(() => {
    setConstroi(false)
    setConstroi(true)
  }, [destroy])

  // Renderização do componente
  return (
    <>
      <h1 className='text-lg w-full px-2'>Editar Turma</h1>
      <div className='flex flex-wrap gap-x-4 p-2 w-full'>
        {/* Campos do formulário para edição de turma */}
        <EleInput 
          label='Professor'
          type='select'
          data={professores}
          name='nome_professor'
          value={form.nome_professor}
          onChange={handleChangeForm}
          disabled
        />
        <EleInput 
          label='Disciplina'
          type='select'
          data={disciplinas}
          size='w-1/2'
          name='disciplina'
          value={form.disciplina}
          onChange={handleChangeForm}
          disabled
        />
        <EleInput 
          label='Série'
          type='select'
          data={salas}
          size='w-1/2'
          name='sala'
          value={form.sala}
          onChange={handleChangeForm}
          disabled
        />
        {/* Linha divisória para separar visualmente as seções do formulário */}
        <div className='border-b my-2 border-gray-400 border-solid w-full'></div>
        {/* Tabela de horários da turma, mostrada apenas se houver horários definidos e a reconstrução é permitida */}
        {formHorarios.length !== 0 && constroi && (
          <>
          <Table className='w-full'>
            <TableHeader>
              <TableRow>
                <TableHead className='w-5'>Ações</TableHead>
                <TableHead className='text-center'>Dia</TableHead>
                <TableHead className='text-center'>Hora</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formHorarios.map((ele) => (
                <TableRow key={ele.dia + ele.hora}>
                  <TableCell><FaTrashAlt onClick={() => {
                    const temp = formHorarios.filter(item => item !== ele)
                    setFormHorarios(temp)
                    setDestroy(!destroy)
                  }} /></TableCell>
                  <TableCell className='text-center'>{diaSemana.find(item => item.uuid === ele.dia)?.name}</TableCell>
                  <TableCell className='text-center'>{ele.hora}:00</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </>
        )}
        {/* Campos de seleção para adicionar novos horários à turma */}
        <EleInput 
          label='Dia da Semana'
          type='select'
          data={diaSemana}
          size='w-1/2'
          name='dia'
          value={formHorario.dia}
          onChange={handleChangeFormHorario}
        />
        <EleInput 
          label='Horário'
          type='select'
          data={horarios}
          size='w-1/2'
          name='hora'
          value={formHorario.hora}
          onChange={handleChangeFormHorario}
        />
        {/* Botão para adicionar os horários selecionados acima à lista de horários da turma */}
        <div className="flex w-full">
          <EleButton onClick={() => {
            if(formHorario.dia === '' || formHorario.hora === ''){
              setMessage('Preencha todos os campos corretamente')
              setAlert(true)
            } else {
              formHorarios.push(formHorario)
              setFormHorario({
                dia: '',
                hora: ''
              })
            }
          }}>Adicionar Horários</EleButton>
        </div>
        {/* Componente para visualização e edição de horários, se houver uma sala selecionada */}
        {dataSala && (<TableHorariosEdit data={dataSala} disciplina={form.disciplina} setTurmas={setTurmas}/>)}
         {/* Botões para cancelar as alterações ou submeter o formulário */}
        <div className='w-full flex'>
          <EleButton onClick={() => props.setView('Listar')}>Cancelar</EleButton>
          <EleButton onClick={handleSubmit}>Editar</EleButton>
        </div>
         {/* Componente de alerta para feedback de ações, como sucesso ou erro na submissão */}
        <EleAlert 
          message={message}
          open={alert}
          setAlert={alertAction}/>
      </div>
    </>
  )
}

export default ModEditTurma