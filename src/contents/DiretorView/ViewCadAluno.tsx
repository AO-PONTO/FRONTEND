// Importação de componentes UI personalizados, interfaces, serviço de API, utilidades e bibliotecas externas.
import { EleButton, EleInput, EleAlert } from '@/components' // Componentes UI para botão, entrada de texto e alerta.
import { cadAluno, propsView } from '@/interface' // Interfaces para tipagem dos dados de aluno e propriedades do componente.
import api from '@/service/api' // Serviço de API para realizar chamadas ao backend.
import { formatDate } from '@/lib/utils' // Função utilitária para formatação de datas.
import uuid from 'react-uuid' // Biblioteca para geração de UUID.
import React from 'react' // Biblioteca React.

// Componente funcional ViewCadAluno para cadastro de alunos.
const ViewCadAluno = (props: propsView) => {
  const date = new Date // Data atual para uso na criação do aluno.

  // Estado do formulário, inicializado com valores padrão e um UUID gerado.
  const [form, setForm] = React.useState<cadAluno>({
    created_at: formatDate(date), // Data de criação formatada.
    data_nascimento: '',
    escola_name: '',
    escola_uuid: '',
    matricula: '',
    nome: '',
    updated_at: null,
    uuid: uuid() // UUID único para o novo aluno.
  })
  const [alert, setAlert] = React.useState<boolean>(false) // Estado para controle da visibilidade do alerta.
  const [exit, setExit] = React.useState<boolean>(false) // Estado para controle da saída após cadastro.
  const [message, setMessage] = React.useState<string>('') // Estado para mensagem de feedback.

  // Função para atualizar o estado do formulário conforme o usuário digita.
  const handleChangeForm = (value: string, label: string) => {
    setForm((prev) => ({ ...prev, [label]: value }))
  }

  // Função assíncrona para submeter o formulário ao backend.
  const handleSubmit = async () => {
    const dataUser = localStorage.getItem('@aplication/aoponto') // Recupera dados do usuário armazenados localmente.
    if (dataUser) {
      const tempUser = JSON.parse(dataUser)
      let updatedForm = { ...form,
        escola_name: tempUser.user.escola_name, // Define nome da escola do aluno a partir do usuário logado.
        escola_uuid: tempUser.user.escola_uuid // Define UUID da escola do aluno.
      }
      // Validação dos campos obrigatórios do formulário.
      if(updatedForm.data_nascimento === '' || updatedForm.matricula === '' || updatedForm.nome === '') {
        setMessage('Preencha todos os campos corretamente')
        setAlert(true)
      } else {
        // Tentativa de cadastro do novo aluno via POST para a API.
        try {
          await api.post('/alunos/', updatedForm)
          setMessage('Aluno cadastrado com sucesso!')
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

  // Função para gerenciar a ação do alerta.
  const alertAction = () => {
    if(exit) {
      setAlert(false)
      props.setView('Listar') // Muda a visualização para a lista de alunos.
    } else {
      setAlert(false)
    }
  }

  // Renderização do componente, incluindo o formulário e o botão de cadastro.
  return (
    <>
      <h1 className='text-lg w-full px-2'>Cadastrar Alunos</h1>
      <div className='flex flex-wrap gap-x-4 p-2 w-full'>
        {/* Campos do formulário para o cadastro de aluno */}
        <EleInput label='Nome' type='text' name='nome' value={form.nome} onChange={handleChangeForm}/>
        <EleInput label='Data de Nascimento' type='date' size='w-1/2' name='data_nascimento' value={form.data_nascimento} onChange={handleChangeForm}/>
        <EleInput label='Matrícula' type='text' name='matricula' size='w-1/2' value={form.matricula} onChange={handleChangeForm}/>
      </div>
      <EleButton onClick={handleSubmit}>Cadastrar</EleButton> {/* Botão para submissão do formulário */}
      <EleAlert message={message} open={alert} setAlert={alertAction}/> {/* Componente de alerta para feedback */}
    </>
  )
}

export default ViewCadAluno // Exporta o componente para utilização em outras partes da aplicação.
