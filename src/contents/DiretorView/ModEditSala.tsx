import { EleButton, EleInput, EleAlert } from '@/components'
import { dataSala, propSelect } from '@/interface'
import api from '@/service/api'
import React from 'react'

interface Module {
  form: dataSala,
  setView: React.Dispatch<React.SetStateAction<string>>,
  reset?: Function
}

const ModEditSala = (props: Module) => {

  const turno:propSelect[] = [
    { name: 'matutino', uuid: 'matutino' },
    { name: 'vespertino', uuid: 'vespertino' },
    { name: 'noturno', uuid: 'noturno' }
  ]

  const date = new Date
  const ano = date.getFullYear().toString()
  const anoQueVem = String(date.getFullYear() + 1)
  const anos:propSelect[] = [
    { name: ano, uuid: ano },
    { name: anoQueVem, uuid: anoQueVem }
  ]

  const [form, setForm] = React.useState<dataSala>(props.form)
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
    if(updatedForm.nome === '' ||
      updatedForm.turno === '' ||
      updatedForm.ano === '') {
      setMessage('Preencha todos os campos corretamente')
      setAlert(true)
    } else {
      try {
        await api.put('/salas/', updatedForm, { params: { uuid: updatedForm.uuid }})
        setMessage('Série editada com sucesso!')
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
          name='nome'
          value={form.nome}
          onChange={handleChangeForm}
          />
        <EleInput 
          label='Ano'
          type='select'
          data={anos}
          size='w-1/2'
          name='ano'
          value={form.ano}
          onChange={handleChangeForm}
        />
        <EleInput 
          label='Turno'
          type='select'
          data={turno}
          size='w-1/2'
          name='turno'
          value={form.turno}
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

export default ModEditSala