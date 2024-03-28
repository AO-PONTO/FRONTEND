import { EleButton, EleInput, EleAlert } from '@/components'
import { dataDisciplinas, dataSala, dataUser, papelRequest, propSelect, propsView } from '@/interface'
import api from '@/service/api'
import { formatDate, stringNumber } from '@/lib/utils'
import React from 'react'

interface Module {
  form: dataDisciplinas,
  setView: React.Dispatch<React.SetStateAction<string>>,
  reset?: Function
}

const ModEditDisc = (props: Module) => {

  const date = new Date

  const [form, setForm] = React.useState<dataDisciplinas>(props.form)
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
    if(updatedForm.name === '') {
      setMessage('Preencha todos os campos corretamente')
      setAlert(true)
    } else {
      try {
        await api.put('/disciplinas/', updatedForm, { params: { uuid: updatedForm.uuid }})
        setMessage('Disciplina editada com sucesso!')
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
      <h1 className='text-lg w-full px-2'>Editar Sala</h1>
      <div className='flex flex-wrap gap-x-4 p-2 w-full'>
        <EleInput 
          label='Nome'
          type='text'
          name='name'
          value={form.name}
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

export default ModEditDisc