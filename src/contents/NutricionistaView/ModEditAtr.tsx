import { EleButton, EleInput, EleAlert } from '@/components'
import { cardapioRequest, dataCardEsc, dataUser, papelRequest, propSelect, propsView } from '@/interface'
import api from '@/service/api'
import { formatDate, stringNumber } from '@/lib/utils'
import React from 'react'

interface Module {
  form: dataCardEsc,
  setView: React.Dispatch<React.SetStateAction<string>>,
  reset?: Function
}

const ModEditAtr = (props: Module) => {

  const diaSemana:propSelect[] = [
    { name: 'segunda', uuid: 'segunda' },
    { name: 'terça', uuid: 'terça' },
    { name: 'quarta', uuid: 'quarta' },
    { name: 'quinta', uuid: 'quinta' },
    { name: 'sexta', uuid: 'sexta' }
  ]

  const turno:propSelect[] = [
    { name: 'matutino', uuid: 'matutino' },
    { name: 'vespertino', uuid: 'vespertino' },
    { name: 'noturno', uuid: 'noturno' }
  ]

  const date = new Date

  const [cardapioSubmit, setCardapioSubmit] = React.useState<cardapioRequest[]>([])
  const [cardapio, setCardapio] = React.useState<propSelect[]>([])
  const [form, setForm] = React.useState<dataCardEsc>(props.form)
  const [alert, setAlert] = React.useState<boolean>(false)
  const [exit, setExit] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState<string>('')
  
  const handleCardapio = async () => {
    try {
      const response = await api.get('/cardapio', { params: { all: true } })
      if (response) {
        const temp = response.data.map((item:cardapioRequest) => {
          return {
            uuid: item.uuid,
            name: item.nome
          }})
        setCardapio(temp)
        const temp2 = response.data.map((item:cardapioRequest) => {
            return {
              nome: item.nome,
              uuid: item.uuid,
              descricao: item.descricao
            }})
        setCardapioSubmit(temp2)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleChangeForm = (value: string, label: string) => {
    setForm((prev) => ({ ...prev, 
      [label]: value
    }))
  }

  const handleSubmit = async () => {
    let updatedForm = form
    if(updatedForm.cardapio_uuid === '' ||
    updatedForm.dia_da_semana === '' ||
    updatedForm.turno === '') {
      setMessage('Preencha todos os campos corretamente')
      setAlert(true)
    } else {
      try {
        await api.put('/cardapio-escola/', updatedForm, { params: { uuid: updatedForm.uuid }})
        setMessage('Atribuição editada com sucesso!')
        setExit(true)
        setAlert(true)
        props.reset && props.reset()
      } catch (error) {
        setMessage('Erro no servidor, tente novamente')
        setAlert(true)
        console.log(error)
      }
    }
  }

  React.useEffect(()=> {
    handleCardapio()
  }, [])

  React.useEffect(()=> {
    const cardapioName = cardapioSubmit.find(item => item.uuid === form.cardapio_uuid)

    if (cardapioName !== undefined) {
      setForm(prev => ({...prev,
        cardapio_name: cardapioName.nome,
        cardapio_descricao: cardapioName.descricao
      }))
    }
  }, [cardapioSubmit, form.cardapio_uuid])

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
      <h1 className='text-lg w-full px-2'>Editar Atribuição</h1>
      <div className='flex flex-wrap gap-x-4 p-2 w-full'>
        <EleInput 
          label='Cardápio'
          type='select'
          data={cardapio}
          size='w-1/2'
          name='cardapio_uuid'
          value={form.cardapio_uuid}
          onChange={handleChangeForm}
          />
        <EleInput 
          label='Dia da Semana'
          type='select'
          data={diaSemana}
          size='w-1/2'
          name='dia_da_semana'
          value={form.dia_da_semana}
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

export default ModEditAtr