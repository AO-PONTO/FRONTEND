import { EleButton, EleInput, EleAlert } from '@/components'
import { cadAluno, propsView } from '@/interface'
import api from '@/service/api'
import { formatDate } from '@/lib/utils'
import uuid from 'react-uuid'
import React from 'react'

const ViewCadAluno = (props: propsView) => {

  const date = new Date

  const [form, setForm] = React.useState<cadAluno>({
    created_at: formatDate(date),
    data_nascimento: '',
    escola_name: '',
    escola_uuid: '',
    matricula: '',
    nome: '',
    updated_at: null,
    uuid: uuid()
  })
  const [alert, setAlert] = React.useState<boolean>(false)
  const [exit, setExit] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState<string>('')

  const handleChangeForm = (value: string, label: string) => {
    setForm((prev) => ({ ...prev, 
      [label]: value
    }))
  }

  const handleSubmit = async () => {
    const dataUser = localStorage.getItem('@aplication/aoponto')
    if (dataUser) {
      const tempUser = JSON.parse(dataUser)
      let updatedForm = { ...form,
        escola_name: tempUser.user.escola_name,
        escola_uuid: tempUser.user.escola_uuid
      }
      if(updatedForm.data_nascimento === '' ||
        updatedForm.matricula === '' ||
        updatedForm.nome === '') {
        setMessage('Preencha todos os campos corretamente')
        setAlert(true)
      } else {
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

  const alertAction = () => {
    if(exit) {
      setAlert(false)
      props.setView('Listar')
    } else {
      setAlert(false)
    }
  }

  return (
    <>
      <h1 className='text-lg w-full px-2'>Cadastrar Alunos</h1>
      <div className='flex flex-wrap gap-x-4 p-2 w-full'>
        <EleInput 
          label='Nome'
          type='text'
          name='nome'
          value={form.nome}
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
          label='Matrícula'
          type='text'
          name='matricula'
          size='w-1/2'
          value={form.matricula}
          onChange={handleChangeForm}
          />
      </div>
      <EleButton onClick={handleSubmit}>Cadastrar</EleButton>
      <EleAlert 
        message={message}
        open={alert}
        setAlert={alertAction}/>
    </>
  )
}

export default ViewCadAluno