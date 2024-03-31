import { EleButton, EleInput, EleAlert } from '@/components' // Importa componentes personalizados de botão, input e alerta
import { cadDisciplinas, propsView } from '@/interface' // Importa tipos de dados de interface
import api from '@/service/api' // Importa o módulo de serviço para fazer requisições à API
import { formatDate, stringNumber } from '@/lib/utils' // Importa funções utilitárias
import uuid from 'react-uuid' // Importa a função para gerar UUIDs únicos
import React from 'react' // Importa a biblioteca React

const ViewCadDisc = (props: propsView) => { // Declaração do componente funcional ViewCadDisc

  const date = new Date // Cria uma instância da data atual

  // Define o estado para o formulário da disciplina, o alerta, a saída e a mensagem
  const [form, setForm] = React.useState<cadDisciplinas>({
    created_at: formatDate(date), // Formata a data de criação da disciplina
    name: '', // Nome da disciplina (inicialmente vazio)
    updated_at: null, // Data de atualização da disciplina (inicialmente nula)
    uuid: uuid() // UUID único para a disciplina
  })
  const [alert, setAlert] = React.useState<boolean>(false) // Estado para controlar a exibição do alerta
  const [exit, setExit] = React.useState<boolean>(false) // Estado para controlar a saída após o cadastro
  const [message, setMessage] = React.useState<string>('') // Mensagem a ser exibida no alerta

  // Função para lidar com a alteração dos valores do formulário
  const handleChangeForm = (value: string, label: string) => {
    setForm((prev) => ({ ...prev, 
      [label]: value
    }))
  }

  // Função para lidar com o envio do formulário
  const handleSubmit = async () => {
    let updatedForm = form // Copia o formulário atual
    if(updatedForm.name === '') { // Verifica se o nome da disciplina está vazio
      setMessage('Preencha todos os campos corretamente') // Define a mensagem de erro
      setAlert(true) // Define o alerta como verdadeiro para exibir a mensagem
    } else {
      try {
        await api.post('/disciplinas/', updatedForm) // Faz a requisição POST para cadastrar a disciplina na API
        setMessage('Disciplina cadastrada com sucesso!') // Define a mensagem de sucesso
        setExit(true) // Define a saída como verdadeira para fechar o modal após o sucesso
        setAlert(true) // Define o alerta como verdadeiro para exibir a mensagem
      } catch (error) {
        setMessage('Erro no servidor, tente novamente') // Define a mensagem de erro
        setAlert(true) // Define o alerta como verdadeiro para exibir a mensagem
        console.log(error) // Log de erro, se houver algum problema na requisição
      }
    }
  }

  // Função para lidar com a ação do alerta (fechar ou redirecionar)
  const alertAction = () => {
    if(exit) {
      setAlert(false) // Define o alerta como falso para fechar o modal
      props.setView('Listar') // Redireciona para a visualização de listagem de disciplinas
    } else {
      setAlert(false) // Define o alerta como falso para fechar o modal
    }
  }

  return (
    <> {/* Fragmento React */}
      <h1 className='text-lg w-full px-2'>Cadastrar Disciplina</h1> {/* Título do formulário */}
      <div className='flex flex-wrap gap-x-4 p-2 w-full'> {/* Div contendo os inputs do formulário */}
        <EleInput 
          label='Nome da Disciplina'
          type='text'
          name='name'
          value={form.name}
          onChange={handleChangeForm}
          />
      </div>
      <EleButton onClick={handleSubmit}>Cadastrar</EleButton> {/* Botão para enviar o formulário de cadastro */}
      <EleAlert 
        message={message}
        open={alert}
        setAlert={alertAction}/> {/* Componente de alerta para exibir mensagens de sucesso ou erro */}
    </>
  )
}

export default ViewCadDisc // Exporta o componente ViewCadDisc
