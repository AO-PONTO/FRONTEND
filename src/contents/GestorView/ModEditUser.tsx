import { EleButton, EleInput, EleAlert } from '@/components'
import { dataUser, papelRequest, propSelect, propsView } from '@/interface'
import api from '@/service/api'
import { formatDate, stringNumber } from '@/lib/utils'
import React from 'react'

interface Module {
  form: dataUser,
  setView: React.Dispatch<React.SetStateAction<string>>,
  reset?: Function
}

const ModEditUser = (props: Module) => {

  const date = new Date

  const [papel, setPapel] = React.useState<propSelect[]>([])
  const [access, setAccess] = React.useState<papelRequest[]>([])
  const [escola, setEscola] = React.useState<propSelect[]>([])
  const [form, setForm] = React.useState<dataUser>(props.form)
  const [alert, setAlert] = React.useState<boolean>(false)
  const [exit, setExit] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState<string>('')
  
  const handleEscolas = async () => {
    try {
      const response = await api.get('/escolas', { params: { all: true } })
      if (response) {
        const temp = response.data.map((item: { uuid: any; nome: any }) => {
          return {
            uuid: item.uuid,
            name: item.nome
          }
        })
        setEscola(temp)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handlePapel = async () => {
    try {
      const response = await api.get('/papel', { params: { all: true } })
      if (response) {
        const temp = response.data.map((item:papelRequest) => {
          if (item.access_level <= 5) {
            return {
              uuid: item.uuid,
              name: item.nome
            }
          }
          return null
        }).filter((ele: null) => ele !== null)
        setPapel(temp)
        const temp2 = response.data.map((item:papelRequest) => {
          if (item.access_level <= 5) {
            return item
          }
          return null
        }).filter((ele: null) => ele !== null)
        setAccess(temp2)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleChangeForm = (value: string, label: string) => {
    if (label === 'cpf') {
      let valor = value.replace(/\D/g, '')
      valor = valor.substring(0, 11)

      valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
      valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      

      setForm((prev) => ({ ...prev, 
        [label]: valor
      }))
    } else {
      setForm((prev) => ({ ...prev, 
        [label]: value
      }))
    }
  }

  const handleSubmit = async () => {
    let updatedForm = { ...form, cpf: form.cpf.replace(/[.-]/g,''), updated_at: date }
    if(updatedForm.cpf === '' ||
      updatedForm.data_nascimento === '' ||
      updatedForm.escola_uuid === '' ||
      updatedForm.papel_uuid === '' ||
      updatedForm.email === '' ||
      !stringNumber(updatedForm.cpf)) {
      setMessage('Preencha todos os campos corretamente')
      setAlert(true)
    } else {
      try {
        await api.put('/usuario/', updatedForm, { params: { uuid: updatedForm.uuid }})
        setMessage('Usuário editado com sucesso!')
        setExit(true)
        setAlert(true)
      } catch (error:any) {
        setMessage(error.config.response.data.detail)
        setAlert(true)
        console.log(error)
      }
    }
  }
  

  React.useEffect(()=> {
    handleEscolas()
    handlePapel()
  }, [])

  React.useEffect(()=> {
    const papelName = papel.find(item => item.uuid === form.papel_uuid)
    const escolaName = escola.find(item => item.uuid === form.escola_uuid)
    const accessLevel = access.find(item => item.uuid === form.papel_uuid)

    if (escolaName !== undefined) {
      setForm(prev => ({...prev,
        escola_name: escolaName.name
      }))
    }

    if (papelName !== undefined) {
      setForm(prev => ({...prev,
        papel_name: papelName.name
      }))
    }

    if (accessLevel !== undefined) {
      setForm(prev => ({...prev,
        access_level: accessLevel.access_level
      }))
    }
  }, [escola, papel, access, form.escola_uuid, form.papel_uuid])

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
      <h1 className='text-lg w-full px-2'>Editar Usuário</h1>
      <div className='flex flex-wrap gap-x-4 p-2'>
        <EleInput 
          label='Nome Completo'
          type='text'
          name='nome'
          value={form.nome}
          onChange={handleChangeForm}
          />
        <EleInput 
          label='CPF'
          type='text'
          size='w-1/2'
          name='cpf'
          value={form.cpf}
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
          label='Escola'
          type='select'
          data={escola}
          size='w-1/2'
          name='escola_uuid'
          value={form.escola_uuid}
          onChange={handleChangeForm}
        />
        <EleInput 
          label='Função'
          type='select'
          data={papel}
          size='w-1/2'
          name='papel_uuid'
          value={form.papel_uuid}
          onChange={handleChangeForm}
        />
        <EleInput 
          label='E-mail'
          type='text'
          name='email'
          value={form.email}
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

export default ModEditUser