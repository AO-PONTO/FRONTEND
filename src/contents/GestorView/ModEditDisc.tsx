import { EleButton, EleInput, EleAlert } from '@/components' // Importa componentes personalizados de botão, input e alerta
import { dataDisciplinas, dataSala, dataUser, papelRequest, propSelect, propsView } from '@/interface' // Importa tipos de dados de interface
import api from '@/service/api' // Importa o módulo de serviço para fazer requisições à API
import { formatDate, stringNumber } from '@/lib/utils' // Importa funções utilitárias
import React from 'react' // Importa a biblioteca React

interface Module {
  form: dataDisciplinas, // Tipo de dados para o formulário da disciplina
  setView: React.Dispatch<React.SetStateAction<string>>, // Função para atualizar o estado da visualização
  reset?: Function // Função opcional para redefinir o estado
}

const ModEditDisc = (props: Module) => { // Declaração do componente funcional ModEditDisc

  const date = new Date // Cria uma instância da data atual

  // Define o estado do formulário da disciplina, do alerta e da saída
  const [form, setForm] = React.useState<dataDisciplinas>(props.form)
  const [alert, setAlert] = React.useState<boolean>(false)
  const [exit, setExit] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState<string>('')

  // Função para lidar com a alteração dos valores do formulário
  const handleChangeForm = (value: string, label: string) => {
    setForm((prev) => ({ ...prev, 
      [label]: value
    }))
  }

  // Função para lidar com o envio do formulário
  const handleSubmit = async () => {
    let updatedForm = { ...form, 
      updated_at: date
    }
    if(updatedForm.name === '') { // Verifica se o campo nome está vazio
      setMessage('Preencha todos os campos corretamente')
      setAlert(true) // Define o alerta como verdadeiro para exibir a mensagem
    } else {
      try {
        await api.put('/disciplinas/', updatedForm, { params: { uuid: updatedForm.uuid }}) // Faz a requisição PUT para atualizar a disciplina na API
        setMessage('Disciplina editada com sucesso!') // Define a mensagem de sucesso
        setExit(true) // Define a saída como verdadeira para fechar o modal após o sucesso
        setAlert(true) // Define o alerta como verdadeiro para exibir a mensagem
      } catch (error) {
        setMessage('Erro no servidor, tente novamente') // Define a mensagem de erro
        setAlert(true) // Define o alerta como verdadeiro para exibir a mensagem
        console.log(error) // Log de erro, se houver algum problema na requisição
      }
    }
  }

  // Função para lidar com a ação do alerta
  const alertAction = () => {
    if(exit) {
      setAlert(false) // Fecha o alerta
      props.setView('Listar') // Retorna para a visualização de listagem
      props.reset && props.reset() // Reseta o estado, se a função reset estiver definida
    } else {
      setAlert(false) // Fecha o alerta
    }
  }

  return (
    <>
      <h1 className='text-lg w-full px-2'>Editar Sala</h1>
      <div className='flex flex-wrap gap-x-4 p-2 w-full'>
        <EleInput 
          label='Nome'
          type='text'
          name='name'
          value={form.name}
          onChange={handleChangeForm}
          /> {/* Componente de input para editar o nome da disciplina */}
      </div>
      <div className='w-full flex'>
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

export default ModEditDisc // Exporta o componente ModEditDisc
