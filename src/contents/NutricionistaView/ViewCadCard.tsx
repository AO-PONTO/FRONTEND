import { EleButton, EleInput, EleAlert } from '@/components' // Importação de componentes de interface
import { cadCardapio, papelRequest, propsView } from '@/interface' // Importação de tipos e interfaces específicos
import api from '@/service/api' // Importação do módulo de API
import { formatDate } from '@/lib/utils' // Importação de função utilitária para formatar datas
import uuid from 'react-uuid' // Importação da biblioteca para geração de UUID
import React from 'react' // Importação do React

// Definição do componente para cadastrar um novo cardápio
const ViewCadCard = (props: propsView) => {

  const date = new Date // Objeto de data atual

  // Estados do componente
  const [form, setForm] = React.useState<cadCardapio>({ // Estado para o formulário de cadastro de cardápio
    created_at: formatDate(date), // Data de criação
    descricao: '', // Descrição do cardápio
    nome: '', // Nome do cardápio
    updated_at: null, // Data de atualização
    uuid: uuid() // UUID único para o cardápio
  })
  const [alert, setAlert] = React.useState<boolean>(false) // Estado para exibir ou ocultar o alerta
  const [exit, setExit] = React.useState<boolean>(false) // Estado para sinalizar a saída do componente
  const [message, setMessage] = React.useState<string>('') // Estado para a mensagem do alerta

  // Função para lidar com a mudança nos campos do formulário
  const handleChangeForm = (value: string, label: string) => {
    setForm((prev) => ({ ...prev, [label]: value }))
  }

  // Função para lidar com o envio do formulário
  const handleSubmit = async () => {
    let updatedForm = form // Copiando o estado do formulário
    if (updatedForm.nome === '' || updatedForm.descricao === '') { // Verificando se os campos obrigatórios foram preenchidos
      setMessage('Preencha todos os campos corretamente') // Definindo mensagem de erro
      setAlert(true) // Exibindo alerta
    } else {
      try {
        await api.post('/cardapio/', updatedForm) // Requisição POST para cadastrar o novo cardápio
        setMessage('Cardápio cadastrado com sucesso!') // Definindo mensagem de sucesso
        setExit(true) // Marcando a saída como verdadeira
        setAlert(true) // Exibindo alerta
      } catch (error) {
        setMessage('Erro no servidor, tente novamente') // Definindo mensagem de erro
        setAlert(true) // Exibindo alerta
        console.log(error) // Lidando com erros
      }
    }
  }

  // Função para lidar com a ação do alerta
  const alertAction = () => {
    if (exit) {
      setAlert(false) // Ocultando o alerta
      props.setView('Listar') // Mudando a visualização para listar os cardápios
    } else {
      setAlert(false) // Ocultando o alerta
    }
  }

  // Retorno do componente
  return (
    <>
      {/* Título do formulário */}
      <h1 className='text-lg w-full px-2'>Cadastrar Cardápio</h1>
      {/* Formulário para cadastrar um novo cardápio */}
      <div className='flex flex-wrap gap-x-4 p-2 w-full'>
        <EleInput 
          label='Nome do Cardápio'
          type='text'
          name='nome'
          value={form.nome}
          onChange={handleChangeForm}
        />
        <EleInput 
          label='Descrição do Cardápio'
          type='textarea'
          name='descricao'
          value={form.descricao}
          onChange={handleChangeForm}
        />
      </div>
      {/* Botão para cadastrar o novo cardápio */}
      <EleButton onClick={handleSubmit}>Cadastrar</EleButton>
      {/* Alerta para exibir mensagens */}
      <EleAlert 
        message={message}
        open={alert}
        setAlert={alertAction}
      />
    </>
  )
}

export default ViewCadCard // Exportação do componente
