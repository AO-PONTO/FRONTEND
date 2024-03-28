import { EleButton, EleInput, EleAlert } from '@/components'
import { cadCardapio, papelRequest, propsView } from '@/interface'
import api from '@/service/api'
import { formatDate } from '@/lib/utils'
import uuid from 'react-uuid'
import React from 'react'

const ViewCadCard = (props: propsView) => {

  const date = new Date

  const [form, setForm] = React.useState<cadCardapio>({
    created_at: formatDate(date),
    descricao: '',
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
    let updatedForm = form
    if(updatedForm.nome === '' ||
      updatedForm.descricao === '') {
      setMessage('Preencha todos os campos corretamente')
      setAlert(true)
    } else {
      try {
        await api.post('/cardapio/', updatedForm)
        setMessage('Cardápio cadastrado com sucesso!')
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
    } else {
      setAlert(false)
    }
  }

  return (
    <>
      <h1 className='text-lg w-full px-2'>Cadastrar Cardápio</h1>
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
      <EleButton onClick={handleSubmit}>Cadastrar</EleButton>
      <EleAlert 
        message={message}
        open={alert}
        setAlert={alertAction}/>
    </>
  )
}

export default ViewCadCard