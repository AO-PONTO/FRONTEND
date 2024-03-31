// Importações dos componentes UI para interação do usuário, interfaces para a tipagem de dados, a API para as requisições ao servidor, utilitários para manipulação de strings e datas, e geração de UUIDs para identificadores únicos.
import { EleButton, EleInput, EleAlert } from '@/components' // Componentes de UI para inputs, botões e alertas.
import { cadSala, propSelect, propsView } from '@/interface' // Interfaces para a tipagem dos dados e propriedades do componente.
import api from '@/service/api' // API para a realização de requisições ao backend.
import { formatDate } from '@/lib/utils' // Utilitários para a formatação de datas e manipulação de strings.
import uuid from 'react-uuid' // Geração de UUIDs para identificadores únicos de novas salas.
import React from 'react' // Importação do React para criação do componente e gerenciamento de estado.

// Componente funcional ViewCadSala para cadastro de novas séries/salas.
const ViewCadSala = (props: propsView) => {
  // Opções de turno disponíveis para seleção no formulário.
  const turno: propSelect[] = [
    { name: 'matutino', uuid: 'matutino' },
    { name: 'vespertino', uuid: 'vespertino' },
    { name: 'noturno', uuid: 'noturno' }
  ]

  const date = new Date // Data atual, usada para marcar a criação da sala.
  const ano = date.getFullYear().toString() // Ano atual.
  const anoQueVem = String(date.getFullYear() + 1) // Ano seguinte.
  // Opções de ano disponíveis para seleção no formulário.
  const anos: propSelect[] = [
    { name: ano, uuid: ano },
    { name: anoQueVem, uuid: anoQueVem }
  ]

  // Estado do formulário para a criação de uma nova sala.
  const [form, setForm] = React.useState<cadSala>({
    nome: '',
    ano: '',
    turno: '',
    escola_uuid: '',
    uuid: uuid(), // Gera um UUID único para a nova sala.
    created_at: formatDate(date), // Formata a data atual para a criação.
    updated_at: null,
  })
  // Estados para o controle de alertas e feedback ao usuário.
  const [alert, setAlert] = React.useState<boolean>(false)
  const [exit, setExit] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState<string>('')

  // Função para atualizar o estado do formulário conforme o usuário altera os valores dos inputs.
  const handleChangeForm = (value: string, label: string) => {
    setForm((prev) => ({ ...prev, [label]: value }))
  }

  // Função assíncrona para submeter o formulário, criando uma nova sala.
  const handleSubmit = async () => {
    const dataUser = localStorage.getItem('@aplication/aoponto') // Recupera informações do usuário logado.
    if (dataUser) {
      const tempUser = JSON.parse(dataUser)
      let updatedForm = { ...form,
        escola_uuid: tempUser.user.escola_uuid // Atribui a UUID da escola do usuário à nova sala.
      }
      // Validação dos campos obrigatórios.
      if(updatedForm.nome === '' || updatedForm.turno === '' || updatedForm.ano === '') {
        setMessage('Preencha todos os campos corretamente')
        setAlert(true)
      } else {
        // Tentativa de envio do novo cadastro de sala para o servidor.
        try {
          await api.post('/salas/', updatedForm)
          setMessage('Série cadastrado com sucesso!')
          setExit(true)
          setAlert(true)
        } catch (error) {
          setMessage('Erro no servidor, tente novamente')
          setAlert(true)
          console.log(error)
        }
      }
    }
  }

  // Função para lidar com ações após o fechamento do alerta.
  const alertAction = () => {
    if(exit) {
      setAlert(false)
      props.setView('Listar') // Retorna à visualização da lista de salas.
    } else {
      setAlert(false)
    }
  }

  // Renderização do componente, incluindo formulário de cadastro e botão de submissão.
  return (
    <>
      <h1 className='text-lg w-full px-2'>Cadastrar Série</h1>
      <div className='flex flex-wrap gap-x-4 p-2 w-full'>
        {/* Inputs para o nome da série, ano e turno. */}
        <EleInput label='Nome da Série' type='text' name='nome' value={form.nome} onChange={handleChangeForm}/>
        <EleInput label='Ano' type='select' data={anos} size='w-1/2' name='ano' value={form.ano} onChange={handleChangeForm}/>
        <EleInput label='Turno' type='select' data={turno} size='w-1/2' name='turno' value={form.turno} onChange={handleChangeForm}/>
      </div>
      <EleButton onClick={handleSubmit}>Cadastrar</EleButton> {/* Botão para executar a submissão do formulário. */}
      <EleAlert message={message} open={alert} setAlert={alertAction}/> {/* Alerta para feedback de ações. */}
    </>
  )
}

export default ViewCadSala // Exporta o componente para utilização em outras partes da aplicação.
