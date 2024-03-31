// Importações necessárias para o componente, incluindo componentes UI, interfaces, API e utilitários.
import { EleButton, EleInput, EleAlert } from '@/components'
import { cadTurma, dataSala, dataUser, horario, propSelect, propsView } from '@/interface'
import api from '@/service/api'
import { formatDate, stringNumber } from '@/lib/utils'
import uuid from 'react-uuid'
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FaTrashAlt } from 'react-icons/fa'
import TableHorarios from './TableHorarios'

// Componente para a visualização e cadastro de novas turmas.
const ViewCadTurma = (props: propsView) => {

  // Dias da semana disponíveis para a seleção de horários.
  const diaSemana:propSelect[] = [
    { name: 'segunda', uuid: '1' },
    { name: 'terça', uuid: '2' },
    { name: 'quarta', uuid: '3' },
    { name: 'quinta', uuid: '4' },
    { name: 'sexta', uuid: '5' }
  ]

  // Data atual para uso na criação da turma.
  const date = new Date

  // Estado inicial do formulário de cadastro da turma.
  const [form, setForm] = React.useState<cadTurma>({
    disciplina: '',
    sala: '',
    nome_professor: '',
    horario: [],
    uuid: uuid(),
    created_at: formatDate(date),
    updated_at: null
  })
  // Estados para armazenar opções e dados selecionados.
  const [disciplinas, setDisciplinas] = React.useState<propSelect[]>([])
  const [salas, setSalas] = React.useState<propSelect[]>([])
  const [dataSalas, setDataSalas] = React.useState<dataSala[]>([])
  const [dataSala, setDataSala] = React.useState<dataSala>({
    ano: '',
    created_at: '',
    escola_uuid: '',
    nome: '',
    turno: '',
    updated_at: '',
    uuid: ''
  })
  const [professores, setProfessores] = React.useState<propSelect[]>([])
  const [alert, setAlert] = React.useState<boolean>(false)
  const [exit, setExit] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState<string>('')
  const [horarios, setHorarios] = React.useState<propSelect[]>([])
  const [formHorarios, setFormHorarios] = React.useState<horario[]>([])
  const [formHorario, setFormHorario] = React.useState<horario>({
    dia: '',
    hora: ''
  })
  const [def, setDef] = React.useState<boolean>(false)
  const [destroy, setDestroy] = React.useState<boolean>(false)
  const [constroi, setConstroi] = React.useState(true)
  const [turmas, setTurmas] = React.useState<cadTurma[]>([])

  const [ok, setOk] = React.useState(false)

  // Manipula as mudanças nos inputs do formulário, atualizando o estado correspondente.
  const handleChangeForm = (value: string, label: string) => {
    setForm((prev) => ({ ...prev, 
      [label]: value
    }))
  }

  // Manipula as mudanças nos horários de aula, atualizando o estado do horário.
  const handleChangeFormHorario = (value: string, label: string) => {
    setFormHorario((prev) => ({ ...prev,
      [label]: value
    }))
  }

  // Busca e carrega dados essenciais (disciplinas, salas e professores) do backend para preencher os seletores do formulário.
  const handleGet = async () => {
    // Obtém dados do usuário logado a partir do localStorage.
    const dataUser = localStorage.getItem('@aplication/aoponto')
    if (dataUser) {
      // Converte os dados do usuário de string JSON para objeto.
      const tempUser = JSON.parse(dataUser)
      try {
        // Requisição para obter todas as disciplinas disponíveis.
        let response = await api.get('/disciplinas', { params: { all: true } })
        // Mapeia a resposta para extrair somente o necessário e atualiza o estado `disciplinas`.
        if (response) {
          const temp = response.data.map((item: { name: any }) => {
            return {
              uuid: item.name,
              name: item.name
            }
          })
          setDisciplinas(temp)
        }
        // Requisição para obter todas as salas relacionadas à escola do usuário.
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
        }
        // Requisição para obter informações de professores (usuários com access_level 2) da escola do usuário.
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
        // Loga qualquer erro que ocorrer durante as requisições.
        console.log(error)
      }
    }
  }

  // Trata o evento de submissão do formulário para cadastrar uma nova turma.
  const handleSubmit = async () => {
    // Verifica se a disciplina já está cadastrada para evitar duplicatas.
    if (ok) {
      // Prepara os dados da nova turma para serem enviados.
      let updatedForm = { ...form,
        horario: formHorarios
      }
      // Validação dos campos obrigatórios.
      if(updatedForm.disciplina === '' ||
        updatedForm.nome_professor === '' ||
        updatedForm.sala === '' ||
        updatedForm.horario.length === 0 ) {
        setMessage('Preencha todos os campos corretamente')
        setAlert(true)
      } else {
        // Verifica se há conflitos de horário com outras turmas.
        const horariosCadastrados: horario[] = []
        turmas.map(item => {
          return item.horario.map(i => horariosCadastrados.push(i))
        })
        if(horariosCadastrados.some(obj1 => {
          return formHorarios.some(obj2 => obj1.dia === obj2.dia && obj1.hora === obj2.hora)
        })) {
          setMessage('Horário requisitado já possui turma')
          setAlert(true)
        } else {
          // Tenta cadastrar a nova turma no servidor.
          try {
            await api.post('/turmas/', updatedForm)
            setMessage('Turma cadastrado com sucesso!')
            setExit(true)
            setAlert(true)
          } catch (error) {
            setMessage('Erro no servidor, tente novamente')
            setAlert(true)
            console.log(error)
          }
        }
      }
    } else {
      setMessage('Disciplina já cadastrada para esta Série')
      setAlert(true)
    }
  }
  // Define a ação a ser realizada quando o alerta é fechado.
  const alertAction = () => {
    if(exit) {
      // Fecha o alerta e redireciona para a visualização da lista de turmas.
      setAlert(false);
      props.setView('Listar');
    } else {
      // Apenas fecha o alerta.
      setAlert(false);
    }
  }

  // Prepara ou cancela a definição dos horários para a turma.
  const handleDef = () => {
    // Verifica se os campos necessários para definir os horários estão preenchidos.
    if(form.sala === '' ||
        form.disciplina === ''||
        form.nome_professor === '') {
        setMessage('Preencha todos os campos corretamente')
        setAlert(true)
      } else {
      // Alterna o estado de definição dos horários.
      if (def) {
        // Reseta os horários se a definição estiver sendo cancelada.
        setHorarios([])
        } else {
        // Identifica o turno da sala selecionada e ajusta os horários disponíveis conforme o turno.
        const periodo = dataSalas.find(item => item.uuid === form.sala)
        if(periodo) { 
          setDataSala(periodo)
          if(periodo?.turno === 'matutino') {
            setHorarios([
              { name: '07:00 - 08:00', uuid: '07' },
              { name: '08:00 - 09:00', uuid: '08' },
              { name: '09:00 - 10:00', uuid: '09' },
              { name: '10:00 - 11:00', uuid: '10' },
            ])
          } else if(periodo?.turno === 'vespertino') {
            setHorarios([
              { name: '13:00 - 14:00', uuid: '13' },
              { name: '14:00 - 15:00', uuid: '14' },
              { name: '15:00 - 16:00', uuid: '15' },
              { name: '16:00 - 17:00', uuid: '16' },
            ])
          } else if(periodo?.turno === 'noturno') {
            setHorarios([
              { name: '19:00 - 20:00', uuid: '19' },
              { name: '20:00 - 21:00', uuid: '20' },
              { name: '21:00 - 22:00', uuid: '21' },
              { name: '22:00 - 23:00', uuid: '22' },
            ])
          }
        }
      }
    setDef(!def)
    }
    // Limpa os horários definidos e o horário atualmente em edição.
    setFormHorarios([])
    setFormHorario({
      dia: '',
      hora: ''
    })
  }

  React.useEffect(() => {
    handleGet()
  }, [])

  React.useEffect(() => {
    setConstroi(false)
    setConstroi(true)
  }, [destroy])
// Início do bloco de retorno do componente.
  return (
    <>
      {/* Título da página */}
      <h1 className='text-lg w-full px-2'>Cadastrar Turma</h1>
      {/* Container para os campos do formulário */}
      <div className='flex flex-wrap gap-x-4 p-2 w-full'>
        {/* Campo de seleção para escolher o professor */}
        <EleInput 
          label='Professor'
          type='select'
          data={professores} // Dados dos professores obtidos da API
          name='nome_professor'
          value={form.nome_professor} // Valor atual para o professor
          onChange={handleChangeForm} // Manipulador para mudanças no campo
          disabled={def} // Desabilita o campo se os horários estão sendo definidos
        />
        {/* Campo de seleção para escolher a disciplina */}
        <EleInput 
          label='Disciplina'
          type='select'
          data={disciplinas} // Dados das disciplinas obtidos da API
          size='w-1/2'
          name='disciplina'
          value={form.disciplina} // Valor atual para a disciplina
          onChange={handleChangeForm} // Manipulador para mudanças no campo
          disabled={def} // Desabilita o campo se os horários estão sendo definidos
        />
        {/* Campo de seleção para escolher a série (sala) */}
        <EleInput 
          label='Série'
          type='select'
          data={salas} // Dados das salas obtidos da API
          size='w-1/2'
          name='sala'
          value={form.sala} // Valor atual para a sala
          onChange={handleChangeForm} // Manipulador para mudanças no campo
          disabled={def} // Desabilita o campo se os horários estão sendo definidos
        />
        {/* Renderiza a seção de horários dinamicamente se a definição de horários estiver ativa */}
        {def && (
          <>
            {/* Divisor visual */}
            <div className='border-b my-2 border-gray-400 border-solid w-full'></div>
            {/* Tabela de horários já definidos, mostrada se existirem horários */}
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
                    {/* Mapeia os horários definidos para linhas na tabela */}
                    {formHorarios.map((ele) => (
                      <TableRow key={ele.dia + ele.hora}>
                        {/* Botão para remover horário */}
                        <TableCell><FaTrashAlt onClick={() => {
                          const temp = formHorarios.filter(item => item !== ele)
                          setFormHorarios(temp)
                          setDestroy(!destroy)
                        }} /></TableCell>
                        {/* Dia e hora do horário */}
                        <TableCell className='text-center'>{diaSemana.find(item => item.uuid === ele.dia)?.name}</TableCell>
                        <TableCell className='text-center'>{ele.hora}:00</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
            {/* Campos para adicionar novos horários */}
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
          </>
        )}
      </div>
      {/* Botões para ações de definição de horários e submissão do formulário */}
      <div className="flex w-full">
        <EleButton onClick={handleDef} >{def ? 'Voltar' : 'Definir Horários'}</EleButton>
        {/* Mostra o botão para adicionar horários somente se a definição de horários estiver ativa */}
        {def && (<EleButton onClick={() => {
          if(formHorario.dia === '' || formHorario.hora === ''){
            setMessage('Preencha todos os campos corretamente')
            setAlert(true)
          } else {
            formHorarios.push(formHorario)
            setFormHorario({ dia: '', hora: '' })
          }
        }}>Adicionar Horários</EleButton>)}
      </div>
      {/* Componente adicional para verificar e mostrar a disponibilidade de horários para a turma */}
      {def && (<TableHorarios data={dataSala} setOk={setOk} disciplina={form.disciplina} setTurmas={setTurmas}/>)}
      {/* Botão para submeter o formulário de cadastro de turma */}
      <EleButton onClick={handleSubmit}>Cadastrar</EleButton>
      {/* Componente de alerta para mostrar mensagens de erro ou sucesso */}
      <EleAlert 
        message={message}
        open={alert}
        setAlert={alertAction}/>
    </>
  )

}

export default ViewCadTurma // Exporta o componente para utilização em outras partes da aplicação.