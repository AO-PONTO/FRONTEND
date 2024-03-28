import { EleButton, EleInput, EleAlert } from '@/components'
import { cadSala, propSelect, propsView } from '@/interface'
import api from '@/service/api'
import { formatDate, stringNumber } from '@/lib/utils'
import uuid from 'react-uuid'
import React from 'react'

const ViewCadSala = (props: propsView) => {

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

  const [form, setForm] = React.useState<cadSala>({
    nome: '',
    ano: '',
    turno: '',
    escola_uuid: '',
    uuid: uuid(),
    created_at: formatDate(date),
    updated_at: null,
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
        escola_uuid: tempUser.user.escola_uuid
      }
      if(updatedForm.nome === '' ||
        updatedForm.turno === '' ||
        updatedForm.ano === '') {
        setMessage('Preencha todos os campos corretamente')
        setAlert(true)
      } else {
        try {
          await api.post('/salas/', updatedForm)
          setMessage('Série cadastrado com sucesso!')
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
      <h1 className='text-lg w-full px-2'>Cadastrar Série</h1>
      <div className='flex flex-wrap gap-x-4 p-2 w-full'>
        <EleInput 
          label='Nome da Série'
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
      <EleButton onClick={handleSubmit}>Cadastrar</EleButton>
      <EleAlert 
        message={message}
        open={alert}
        setAlert={alertAction}/>
    </>
  )
}

export default ViewCadSala