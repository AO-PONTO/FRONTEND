import { EleButton, EleInput, EleAlert } from '@/components'
import { cadUser, papelRequest, propSelect, propsView } from '@/interface'
import api from '@/service/api'
import { formatDate, stringNumber } from '@/lib/utils'
import uuid from 'react-uuid'
import React from 'react'

const ViewCadUser = (props: propsView) => {

  const date = new Date

  const [papel, setPapel] = React.useState<propSelect[]>([])
  const [access, setAccess] = React.useState<papelRequest[]>([])
  const [form, setForm] = React.useState<cadUser>({
    nome: '',
    access_level: '',
    active: true,
    cpf: '',
    created_at: formatDate(date),
    data_nascimento: '',
    email: '',
    escola_name: '',
    escola_uuid: '',
    papel_name: '',
    papel_uuid: '',
    senha: '',
    updated_at: null,
    uuid: uuid()
  })
  const [alert, setAlert] = React.useState<boolean>(false)
  const [exit, setExit] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState<string>('')

  const handlePapel = async () => {
    try {
      const response = await api.get('/papel', { params: { all: true } })
      if (response) {
        const temp = response.data.map((item:papelRequest) => {
          if (item.access_level <= 3) {
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
    const dataUser = localStorage.getItem('@aplication/aoponto')
    if (dataUser) {
      const tempUser = JSON.parse(dataUser)
      let updatedForm = { ...form,
        cpf: form.cpf.replace(/[.-]/g,''),
        escola_name: tempUser.user.escola_name,
        escola_uuid: tempUser.user.escola_uuid
      }
      if(updatedForm.cpf === '' ||
        updatedForm.data_nascimento === '' ||
        updatedForm.papel_uuid === '' ||
        updatedForm.email === '' ||
        updatedForm.senha === '' ||
        !stringNumber(updatedForm.cpf)) {
        setMessage('Preencha todos os campos corretamente')
        setAlert(true)
      } else {
        try {
          await api.post('/usuario/', updatedForm)
          setMessage('Usuário cadastrado com sucesso!')
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
  

  React.useEffect(()=> {
    handlePapel()
  }, [])

  React.useEffect(()=> {
    const papelName = papel.find(item => item.uuid === form.papel_uuid)
    const accessLevel = access.find(item => item.uuid === form.papel_uuid)

    if (papelName !== undefined) {
      setForm(prev => ({...prev,
        papel_name: papelName.name
      }))
    }

    if (accessLevel !== undefined) {
      setForm(prev => ({...prev,
        access_level: accessLevel.access_level.toString()
      }))
    }
  }, [papel, access, form.papel_uuid])

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
      <h1 className='text-lg w-full px-2'>Cadastrar Usuários</h1>
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
          size='w-1/2'
          onChange={handleChangeForm}
        />
        <EleInput 
          label='Senha'
          type='password'
          size='w-1/2'
          name='senha'
          value={form.senha}
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

export default ViewCadUser