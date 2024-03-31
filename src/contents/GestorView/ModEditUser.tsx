import { EleButton, EleInput, EleAlert } from '@/components' // Importa componentes personalizados de botão, input e alerta
import { dataUser, papelRequest, propSelect, propsView } from '@/interface' // Importa tipos de dados de interface
import api from '@/service/api' // Importa o módulo de serviço para fazer requisições à API
import { formatDate, stringNumber } from '@/lib/utils' // Importa funções utilitárias
import React from 'react' // Importa a biblioteca React

interface Module {
  form: dataUser, // Tipo de dados para o formulário do usuário
  setView: React.Dispatch<React.SetStateAction<string>>, // Função para atualizar o estado da visualização
  reset?: Function // Função opcional para redefinir o estado
}

const ModEditUser = (props: Module) => { // Declaração do componente funcional ModEditUser

  const date = new Date // Cria uma instância da data atual

  // Define o estado para os tipos de dados de papel, acesso e escola, o formulário do usuário, o alerta, a saída e a mensagem
  const [papel, setPapel] = React.useState<propSelect[]>([])
  const [access, setAccess] = React.useState<papelRequest[]>([])
  const [escola, setEscola] = React.useState<propSelect[]>([])
  const [form, setForm] = React.useState<dataUser>(props.form)
  const [alert, setAlert] = React.useState<boolean>(false)
  const [exit, setExit] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState<string>('')
  
  // Função para lidar com a busca das escolas na API
  const handleEscolas = async () => {
    try {
      const response = await api.get('/escolas', { params: { all: true } }) // Faz uma requisição GET para obter todas as escolas
      if (response) {
        const temp = response.data.map((item: { uuid: any; nome: any }) => { // Mapeia os dados da resposta para formatá-los como propSelect
          return {
            uuid: item.uuid,
            name: item.nome
          }
        })
        setEscola(temp) // Define o estado das escolas com os dados formatados
      }
    } catch (error) {
      console.log(error) // Log de erro, se houver algum problema na requisição
    }
  }

  // Função para lidar com a busca dos papéis na API
  const handlePapel = async () => {
    try {
      const response = await api.get('/papel', { params: { all: true } }) // Faz uma requisição GET para obter todos os papéis
      if (response) {
        const temp = response.data.map((item:papelRequest) => {
          if (item.access_level <= 5) { // Filtra os papéis com nível de acesso menor ou igual a 5
            return {
              uuid: item.uuid,
              name: item.nome
            }
          }
          return null
        }).filter((ele: null) => ele !== null) // Remove os elementos nulos do array
        setPapel(temp) // Define o estado dos papéis com os dados formatados
        const temp2 = response.data.map((item:papelRequest) => {
          if (item.access_level <= 5) { // Filtra os papéis com nível de acesso menor ou igual a 5
            return item
          }
          return null
        }).filter((ele: null) => ele !== null) // Remove os elementos nulos do array
        setAccess(temp2) // Define o estado dos acessos com os dados formatados
      }
    } catch (error) {
      console.log(error) // Log de erro, se houver algum problema na requisição
    }
  }

  // Função para lidar com a alteração dos valores do formulário
  const handleChangeForm = (value: string, label: string) => {
    if (label === 'cpf') { // Verifica se o campo alterado é o CPF
      let valor = value.replace(/\D/g, '') // Remove todos os caracteres não numéricos do valor
      valor = valor.substring(0, 11) // Limita o valor a 11 caracteres

      valor = valor.replace(/(\d{3})(\d)/, '$1.$2') // Formata o CPF
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2') // Formata o CPF
      valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2') // Formata o CPF

      setForm((prev) => ({ ...prev, 
        [label]: valor
      }))
    } else {
      setForm((prev) => ({ ...prev, 
        [label]: value
      }))
    }
  }

  // Função para lidar com o envio do formulário
  const handleSubmit = async () => {
    let updatedForm = { ...form, cpf: form.cpf.replace(/[.-]/g,''), updated_at: date } // Formata o CPF e define a data de atualização
    if(updatedForm.cpf === '' ||
      updatedForm.data_nascimento === '' ||
      updatedForm.escola_uuid === '' ||
      updatedForm.papel_uuid === '' ||
      updatedForm.email === '' ||
      !stringNumber(updatedForm.cpf)) { // Verifica se todos os campos necessários foram preenchidos corretamente
      setMessage('Preencha todos os campos corretamente') // Define a mensagem de erro
      setAlert(true) // Define o alerta como verdadeiro para exibir a mensagem
    } else {
      try {
        await api.put('/usuario/', updatedForm, { params: { uuid: updatedForm.uuid }}) // Faz a requisição PUT para atualizar os dados do usuário na API
        setMessage('Usuário editado com sucesso!') // Define a mensagem de sucesso
        setExit(true) // Define a saída como verdadeira para fechar o modal após o sucesso
        setAlert(true) // Define o alerta como verdadeiro para exibir a mensagem
      } catch (error:any) {
        setMessage(error.config.response.data.detail) // Define a mensagem de erro com base na resposta da API
        setAlert(true) // Define o alerta como verdadeiro para exibir a mensagem
        console.log(error) // Log de erro, se houver algum problema na requisição
      }
    }
  }
  

  React.useEffect(()=> {
    handleEscolas() // Executa a função para buscar as escolas quando o componente é montado
    handlePapel() // Executa a função para buscar os papéis quando o componente é montado
  }, [])

  // Efeito para atualizar os nomes da escola, do papel e o nível de acesso do usuário selecionado
  React.useEffect(()=> {
    const papelName = papel.find(item => item.uuid === form.papel_uuid) // Encontra o nome do papel com base no UUID
    const escolaName = escola.find(item => item.uuid === form.escola_uuid) // Encontra o nome da escola com base no UUID
    const accessLevel = access.find(item => item.uuid === form.papel_uuid) // Encontra o nível de acesso com base no UUID do papel

    if (escolaName !== undefined) {
      setForm(prev => ({...prev,
        escola_name: escolaName.name
      }))
    }

    if (papelName !== undefined) {
      setForm(prev => ({...prev,
        papel_name: papelName.name
      }))
    }

    if (accessLevel !== undefined) {
      setForm(prev => ({...prev,
        access_level: accessLevel.access_level
      }))
    }
  }, [escola, papel, access, form.escola_uuid, form.papel_uuid])

  // Função para lidar com a ação do alerta (fechar ou redirecionar)
  const alertAction = () => {
    if(exit) {
      setAlert(false) // Define o alerta como falso para fechar o modal
      props.setView('Listar') // Redireciona para a visualização de listagem de usuários
      props.reset && props.reset() // Reseta o estado, se a função de reset estiver definida
    } else {
      setAlert(false) // Define o alerta como falso para fechar o modal
    }
  }

  return (
    <> {/* Fragmento React */}
      <h1 className='text-lg w-full px-2'>Editar Usuário</h1> {/* Título do formulário */}
      <div className='flex flex-wrap gap-x-4 p-2'> {/* Div contendo os inputs do formulário */}
        {/* Inputs para editar os dados do usuário */}
        <EleInput 
          label='Nome Completo'
          type='text'
          name='nome'
          value={form.nome}
          onChange={handleChangeForm}
          />
        <EleInput 
          label='CPF'
          type='text'
          size='w-1/2'
          name='cpf'
          value={form.cpf}
          onChange={handleChangeForm}
          />
        <EleInput 
          label='Data de Nascimento'
          type='date'
          size='w-1/2'
          name='data_nascimento'
          value={form.data_nascimento}
          onChange={handleChangeForm}
        />
        <EleInput 
          label='Escola'
          type='select'
          data={escola}
          size='w-1/2'
          name='escola_uuid'
          value={form.escola_uuid}
          onChange={handleChangeForm}
        />
        <EleInput 
          label='Função'
          type='select'
          data={papel}
          size='w-1/2'
          name='papel_uuid'
          value={form.papel_uuid}
          onChange={handleChangeForm}
        />
        <EleInput 
          label='E-mail'
          type='text'
          name='email'
          value={form.email}
          onChange={handleChangeForm}
        />
      </div>
      <div className='w-full flex'> {/* Div contendo os botões de Cancelar e Editar */}
        <EleButton onClick={() => props.setView('Listar')}>Cancelar</EleButton> {/* Botão para cancelar a edição */}
        <EleButton onClick={handleSubmit}>Editar</EleButton> {/* Botão para enviar o formulário de edição */}
      </div>
      <EleAlert 
        message={message}
        open={alert}
        setAlert={alertAction}/> {/* Componente de alerta para exibir mensagens de sucesso ou erro */}
    </>
  )
}

export default ModEditUser // Exporta o componente ModEditUser
