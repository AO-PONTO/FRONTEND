import { EleButton, EleInput, EleAlert } from '@/components' // Importação de componentes de interface
import { dataCardapio } from '@/interface' // Importação de tipos e interfaces específicos
import api from '@/service/api' // Importação do módulo de API
import { formatDate, stringNumber } from '@/lib/utils' // Importação de funções utilitárias
import React from 'react' // Importação do React

// Definição da interface para o componente
interface Module {
  form: dataCardapio, // Estrutura de dados para o formulário
  setView: React.Dispatch<React.SetStateAction<string>>, // Função para atualizar a visualização
  reset?: Function // Função opcional para redefinir o estado do formulário
}

// Componente de edição de cardápio
const ModEditCard = (props: Module) => {

  const date = new Date // Objeto de data atual

  // Estados do componente
  const [form, setForm] = React.useState<dataCardapio>(props.form) // Estado para o formulário
  const [alert, setAlert] = React.useState<boolean>(false) // Estado para o alerta
  const [exit, setExit] = React.useState<boolean>(false) // Estado para sinalizar saída
  const [message, setMessage] = React.useState<string>('') // Estado para a mensagem do alerta
  
  // Função para lidar com a mudança nos campos do formulário
  const handleChangeForm = (value: string, label: string) => {
    setForm((prev) => ({ ...prev, [label]: value }))
  }

  // Função para lidar com o envio do formulário
  const handleSubmit = async () => {
    let updatedForm = form
    if (updatedForm.nome === '' ||
      updatedForm.descricao === '') {
      // Verificação se todos os campos obrigatórios foram preenchidos
      setMessage('Preencha todos os campos corretamente')
      setAlert(true)
    } else {
      try {
        // Requisição PUT para atualizar o cardápio
        await api.put('/cardapio/', updatedForm, { params: { uuid: updatedForm.uuid }})
        setMessage('Cardápio editado com sucesso!')
        setExit(true)
        setAlert(true)
      } catch (error) {
        setMessage('Erro no servidor, tente novamente')
        setAlert(true)
        console.log(error)
      }
    }
  }

  // Função para lidar com a ação do alerta
  const alertAction = () => {
    if (exit) {
      setAlert(false)
      props.setView('Listar') // Atualização da visualização para listar os cardápios
      props.reset && props.reset() // Redefinição opcional do estado do formulário
    } else {
      setAlert(false)
    }
  }

  // Retorno do componente
  return (
    <>
      {/* Título do formulário */}
      <h1 className='text-lg w-full px-2'>Editar Cardápio</h1>
      {/* Formulário de edição de cardápio */}
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
      {/* Botões de ação */}
      <div className='w-full flex'>
        <EleButton onClick={() => props.setView('Listar')}>Cancelar</EleButton>
        <EleButton onClick={handleSubmit}>Editar</EleButton>
      </div>
      {/* Alerta para exibir mensagens */}
      <EleAlert 
        message={message}
        open={alert}
        setAlert={alertAction}
      />
    </>
  )
}

export default ModEditCard // Exportação do componente
