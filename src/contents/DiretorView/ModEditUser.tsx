// Importações dos componentes, interfaces, serviço de API e utilidades necessárias.
import { EleButton, EleInput, EleAlert } from '@/components' // Componentes de UI personalizados.
import { dataUser, papelRequest, propSelect } from '@/interface' // Interfaces para tipagem de dados.
import api from '@/service/api' // API para comunicação com o backend.
import { formatDate, stringNumber } from '@/lib/utils' // Funções utilitárias para formatação.
import React from 'react' // Importação do React.

// Definição da interface para as propriedades esperadas pelo componente.
interface Module {
  form: dataUser, // Dados do usuário a ser editado.
  setView: React.Dispatch<React.SetStateAction<string>>, // Função para mudar a visualização atual.
  reset?: Function // Função opcional para resetar o estado.
}

// Componente funcional para a edição de usuário.
const ModEditUser = (props: Module) => {
  const date = new Date // Data atual para uso em registros de atualização.

  // Estados do componente.
  const [papel, setPapel] = React.useState<propSelect[]>([]) // Estado para os papéis (funções) disponíveis.
  const [access, setAccess] = React.useState<papelRequest[]>([]) // Estado para os níveis de acesso disponíveis.
  const [form, setForm] = React.useState<dataUser>(props.form) // Estado inicial do formulário, baseado nas propriedades.
  const [alert, setAlert] = React.useState<boolean>(false) // Estado para controle de visibilidade do alerta.
  const [exit, setExit] = React.useState<boolean>(false) // Estado para controlar a saída após operações.
  const [message, setMessage] = React.useState<string>('') // Estado para mensagens de feedback.

  const permission = form.access_level // Nível de permissão do usuário baseado nos dados do formulário.

  // Função para carregar os papéis e níveis de acesso do usuário.
  const handlePapel = async () => {
    try {
      const response = await api.get('/papel', { params: { all: true } }) // Chamada para a API buscando todos os papéis.
      if (response) {
        // Filtra os papéis para aqueles com acesso menor ou igual a 3 e atualiza o estado.
        const temp = response.data.map((item:papelRequest) => {
          if (item.access_level <= 3) {
            return { uuid: item.uuid, name: item.nome }
          }
          return null
        }).filter((ele: null) => ele !== null)
        setPapel(temp)

        // Filtra os papéis para aqueles com acesso menor ou igual a 5 e atualiza o estado.
        const temp2 = response.data.map((item:papelRequest) => {
          if (item.access_level <= 5) {
            return item
          }
          return null
        }).filter((ele: null) => ele !== null)
        setAccess(temp2)
      }
    } catch (error) {
      console.log(error) // Log de erro em caso de falha na requisição.
    }
  }

  // Função para manipular mudanças no formulário.
  const handleChangeForm = (value: string, label: string) => {
    // Tratamento especial para o campo de CPF, formatando o valor.
    if (label === 'cpf') {
      let valor = value.replace(/\D/g, '') // Remove caracteres não numéricos.
      valor = valor.substring(0, 11) // Limita a 11 caracteres.

      // Aplica formatação para CPF.
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
      valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      
      setForm((prev) => ({ ...prev, [label]: valor }))
    } else {
      // Atualiza o estado do formulário para outros campos.
      setForm((prev) => ({ ...prev, [label]: value }))
    }
  }

  // Função para submeter o formulário de edição.
  const handleSubmit = async () => {
    // Prepara o formulário para envio, incluindo a remoção de formatação do CPF.
    let updatedForm = { ...form, cpf: form.cpf.replace(/[.-]/g,''), updated_at: date }
    // Verifica se o usuário tem permissão para editar e se todos os campos obrigatórios estão preenchidos.
    if(permission <= 3) {
      if(updatedForm.cpf === '' || updatedForm.data_nascimento === '' || updatedForm.papel_uuid === '' || updatedForm.email === '' || !stringNumber(updatedForm.cpf)) {
        setMessage('Preencha todos os campos corretamente')
        setAlert(true)
      } else {
        // Tenta atualizar as informações do usuário via API.
        try {
          await api.put('/usuario/', updatedForm, { params: { uuid: updatedForm.uuid }})
          setMessage('Usuário editado com sucesso!')
          setExit(true)
          setAlert(true)
        } catch (error) {
          setMessage('Erro no servidor, tente novamente')
          setAlert(true)
          console.log(error)
        }
      }
    } else {
      // Caso o usuário não tenha permissão suficiente.
      setMessage('Você não possui permissão para alterar um usuário cadastrado nesta função, se necessário, entre em contato com o gestor da sua região')
      setAlert(true)
      setExit(true)
    }
  }

  // Efeito para carregar os papéis no montar do componente.
  React.useEffect(()=> {
    handlePapel()
  }, [])

  // Efeito para atualizar os nomes dos papéis e níveis de acesso quando estes estados ou o papel_uuid do formulário mudarem.
  React.useEffect(()=> {
    const papelName = papel.find(item => item.uuid === form.papel_uuid)
    const accessLevel = access.find(item => item.uuid === form.papel_uuid)

    if (papelName !== undefined) {
      setForm(prev => ({...prev, papel_name: papelName.name }))
    }

    if (accessLevel !== undefined) {
      setForm(prev => ({...prev, access_level: accessLevel.access_level }))
    }
  }, [papel, access, form.papel_uuid])

  // Função chamada ao fechar o alerta, podendo levar ao fechamento do formulário de edição.
  const alertAction = () => {
    if(exit) {
      setAlert(false)
      props.setView('Listar') // Muda a visualização para a lista de usuários.
      props.reset && props.reset() // Chama a função de reset, se disponível.
    } else {
      setAlert(false)
    }
  }

  // Renderização do componente, incluindo campos do formulário e botões de ação.
  return (
    <>
      <h1 className='text-lg w-full px-2'>Editar Usuário</h1>
      <div className='flex flex-wrap gap-x-4 p-2 w-full'>
        {/* Campos de entrada para informações do usuário */}
        <EleInput label='Nome Completo' type='text' name='nome' value={form.nome} onChange={handleChangeForm} />
        <EleInput label='CPF' type='text' size='w-1/2' name='cpf' value={form.cpf} onChange={handleChangeForm} />
        <EleInput label='Data de Nascimento' type='date' size='w-1/2' name='data_nascimento' value={form.data_nascimento} onChange={handleChangeForm} />
        <EleInput label='Função' type='select' data={papel} size='w-1/2' name='papel_uuid' value={form.papel_uuid} onChange={handleChangeForm} />
        <EleInput label='E-mail' type='text' name='email' value={form.email} size='w-1/2' onChange={handleChangeForm} />
      </div>
      <div className='w-full flex'>
        {/* Botões para cancelar a edição ou submeter as alterações */}
        <EleButton onClick={() => props.setView('Listar')}>Cancelar</EleButton>
        <EleButton onClick={handleSubmit}>Editar</EleButton>
      </div>
      {/* Componente de alerta para feedback ao usuário */}
      <EleAlert message={message} open={alert} setAlert={alertAction}/>
    </>
  )
}

export default ModEditUser // Exporta o componente para uso em outros lugares da aplicação.
