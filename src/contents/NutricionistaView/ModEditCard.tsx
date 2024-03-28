import { EleButton, EleInput, EleAlert } from '@/components'
import { dataCardapio, dataUser, papelRequest, propSelect } from '@/interface'
import api from '@/service/api'
import { formatDate, stringNumber } from '@/lib/utils'
import React from 'react'

interface Module {
  form: dataCardapio,
  setView: React.Dispatch<React.SetStateAction<string>>,
  reset?: Function
}

const ModEditCard = (props: Module) => {

  const date = new Date

  const [form, setForm] = React.useState<dataCardapio>(props.form)
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
      <h1 className='text-lg w-full px-2'>Editar Cardápio</h1>
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

export default ModEditCard