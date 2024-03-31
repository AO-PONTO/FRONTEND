// Importa componentes e utilitários necessários.
import { EleButton, EleInput, EleAlert } from '@/components'
import { cadUser, papelRequest, propSelect, propsView } from '@/interface'
import api from '@/service/api'
import { formatDate, stringNumber } from '@/lib/utils'
import uuid from 'react-uuid'
import React from 'react'

// Define o componente ViewCadUser, que recebe props para gerenciar a visualização.
const ViewCadUser = (props: propsView) => {
  // Cria estados para gerenciar os dados do formulário e outros controles.
  const date = new Date

  // Estados para gerenciar os papéis (funções) disponíveis e o nível de acesso.
  const [papel, setPapel] = React.useState<propSelect[]>([])
  const [access, setAccess] = React.useState<papelRequest[]>([])
  
  // Estado inicial do formulário para cadastrar um novo usuário.
  const [form, setForm] = React.useState<cadUser>({
    nome: '',
    access_level: '',
    active: true,
    cpf: '',
    created_at: formatDate(date),
    data_nascimento: '',
    email: '',
    escola_name: '',
    escola_uuid: '',
    papel_name: '',
    papel_uuid: '',
    senha: '',
    updated_at: null,
    uuid: uuid()
  })

  // Estados para controle de alertas e navegação.
  const [alert, setAlert] = React.useState<boolean>(false)
  const [exit, setExit] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState<string>('')

  // Carrega os papéis disponíveis da API ao iniciar o componente.
  const handlePapel = async () => {
    try {
      const response = await api.get('/papel', { params: { all: true } })
      if (response) {
        // Filtra e configura os papéis e níveis de acesso disponíveis.
        const temp = response.data.map((item:papelRequest) => item.access_level <= 3 ? { uuid: item.uuid, name: item.nome } : null).filter((ele: null) => ele !== null)
        setPapel(temp)
        const temp2 = response.data.map((item:papelRequest) => item.access_level <= 5 ? item : null).filter((ele: null) => ele !== null)
        setAccess(temp2)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Atualiza o estado do formulário ao modificar os campos.
  const handleChangeForm = (value: string, label: string) => {
    // Formata o CPF automaticamente.
    if (label === 'cpf') {
      let valor = value.replace(/\D/g, '').substring(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      setForm((prev) => ({ ...prev, [label]: valor }))
    } else {
      setForm((prev) => ({ ...prev, [label]: value }))
    }
  }

  // Submete os dados do formulário para a API para criar um novo usuário.
  const handleSubmit = async () => {
    const dataUser = localStorage.getItem('@aplication/aoponto')
    if (dataUser) {
      const tempUser = JSON.parse(dataUser)
      let updatedForm = { ...form, cpf: form.cpf.replace(/[.-]/g,''), escola_name: tempUser.user.escola_name, escola_uuid: tempUser.user.escola_uuid }
      // Validação básica dos campos obrigatórios.
      if(updatedForm.cpf === '' || updatedForm.data_nascimento === '' || updatedForm.papel_uuid === '' || updatedForm.email === '' || updatedForm.senha === '' || !stringNumber(updatedForm.cpf)) {
        setMessage('Preencha todos os campos corretamente')
        setAlert(true)
      } else {
        // Tenta criar o usuário e configura o estado baseado na resposta.
        try {
          await api.post('/usuario/', updatedForm)
          setMessage('Usuário cadastrado com sucesso!')
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

  // Carrega os papéis disponíveis ao iniciar o componente.
  React.useEffect(()=> {
    handlePapel()
  }, [])

  // Atualiza o nome do papel e o nível de acesso no estado do formulário.
  React.useEffect(()=> {
    const papelName = papel.find(item => item.uuid === form.papel_uuid)
    const accessLevel = access.find(item => item.uuid === form.papel_uuid)
    if (papelName !== undefined) setForm(prev => ({...prev, papel_name: papelName.name }))
    if (accessLevel !== undefined) setForm(prev => ({...prev, access_level: accessLevel.access_level.toString() }))
  }, [papel, access, form.papel_uuid])

  // Define a ação após fechar um alerta.
  const alertAction = () => {
    if(exit) {
      setAlert(false)
      props.setView('Listar')
    } else {
      setAlert(false)
    }
  }

  // Estrutura de renderização do componente.
  return (
    <>
      <h1 className='text-lg w-full px-2'>Cadastrar Usuários</h1>
      <div className='flex flex-wrap gap-x-4 p-2'>
        {/* Campos de entrada para dados do usuário. */}
        <EleInput label='Nome Completo' type='text' name='nome' value={form.nome} onChange={handleChangeForm} />
        <EleInput label='CPF' type='text' size='w-1/2' name='cpf' value={form.cpf} onChange={handleChangeForm} />
        <EleInput label='Data de Nascimento' type='date' size='w-1/2' name='data_nascimento' value={form.data_nascimento} onChange={handleChangeForm} />
        <EleInput label='Função' type='select' data={papel} size='w-1/2' name='papel_uuid' value={form.papel_uuid} onChange={handleChangeForm} />
        <EleInput label='E-mail' type='text' name='email' value={form.email} size='w-1/2' onChange={handleChangeForm} />
        <EleInput label='Senha' type='password' size='w-1/2' name='senha' value={form.senha} onChange={handleChangeForm} />
      </div>
      <EleButton onClick={handleSubmit}>Cadastrar</EleButton>
      <EleAlert message={message} open={alert} setAlert={alertAction} />
    </>
  )
}

export default ViewCadUser
