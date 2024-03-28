import { EleButton, EleInput, EleAlert } from '@/components'
import { dataAluno } from '@/interface'
import api from '@/service/api'
import React from 'react'

interface Module {
  form: dataAluno,
  setView: React.Dispatch<React.SetStateAction<string>>,
  reset?: Function
}

const ModEditAluno = (props: Module) => {

  const date = new Date

  const [form, setForm] = React.useState<dataAluno>(props.form)
  const [alert, setAlert] = React.useState<boolean>(false)
  const [exit, setExit] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState<string>('')

  const handleChangeForm = (value: string, label: string) => {
    setForm((prev) => ({ ...prev, 
      [label]: value
    }))
  }

  const handleSubmit = async () => {
    let updatedForm = { ...form, 
      updated_at: date
    }
    if(updatedForm.data_nascimento === '' ||
      updatedForm.matricula === '' ||
      updatedForm.nome === '') {
      setMessage('Preencha todos os campos corretamente')
      setAlert(true)
    } else {
      try {
        await api.put('/alunos/', updatedForm, { params: { uuid: updatedForm.uuid }})
        setMessage('Usuário editado com sucesso!')
        setExit(true)
        setAlert(true)
      } catch (error) {
        setMessage('Erro no servidor, tente novamente')
        setAlert(true)
        console.log(error)
      }
    }
  }

  const alertAction = () => {
    if(exit) {
      setAlert(false)
      props.setView('Listar')
      props.reset && props.reset()
    } else {
      setAlert(false)
    }
  }

  return (
    <>
      <h1 className='text-lg w-full px-2'>Editar Aluno</h1>
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
          value={form.matricula.toString()}
          onChange={handleChangeForm}
          />
      </div>
      <div className='w-full flex'>
        <EleButton onClick={() => props.setView('Listar')}>Cancelar</EleButton>
        <EleButton onClick={handleSubmit}>Editar</EleButton>
      </div>
      <EleAlert 
        message={message}
        open={alert}
        setAlert={alertAction}/>
    </>
  )
}

export default ModEditAluno