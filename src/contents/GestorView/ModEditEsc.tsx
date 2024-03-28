import { EleButton, EleInput, EleAlert } from '@/components'
import { categoriaAdministrativa, etapaEnsino } from '@/data/selectsData'
import { cadEsc, dataEsc, propsView, typeCep } from '@/interface'
import { formatDate, stringNumber } from '@/lib/utils'
import api from '@/service/api'
import axios from 'axios'
import React from 'react'

interface Module {
  form: dataEsc,
  setView: React.Dispatch<React.SetStateAction<string>>,
  reset?: Function
}

const ModEditEsc = (props: Module) => {

  const date = new Date

  const [form, setForm] = React.useState<cadEsc>(props.form)
  const [alert, setAlert] = React.useState<boolean>(false)
  const [exit, setExit] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState<string>('')

  const handleChangeForm = (value: string, label: string) => {
    if (label === 'cep') {
      let valor = value.replace(/\D/g, '')
      valor = valor.substring(0, 8)

      pesquisacep(valor)

      valor = valor.replace(/(\d{5})(\d)/, '$1-$2');

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
    let updateForm = { ...form,
      cep: form.cep.replace('-',''),
      updated_at: date
    }
    if (updateForm.nome === '' ||
      updateForm.categoria_administrativa === '' ||
      updateForm.etapa_ensino === '' ||
      updateForm.inep_codigo === '' ||
      updateForm.cep === '' ||
      !stringNumber(updateForm.inep_codigo) ||
      !stringNumber(updateForm.cep)) {
      setMessage('Preencha todos os campos corretamente')
      setAlert(true)
    } else {
      try {
        await api.put('/escolas/', updateForm, { params: { uuid: updateForm.uuid }})
        setMessage('Escola editada com sucesso!')
        setExit(true)
        setAlert(true)
      } catch (error) {
        setMessage('Erro no servidor, tente novamente')
        setAlert(true)
        console.log(error)
      }
    }
  }

  const pesquisacep = (value: string) => {
    if (value.length >= 8) {
    axios.get('https://viacep.com.br/ws/'+ value + '/json/')
      .then((response: any) => {
        if(response.statusText === 'OK') {
          setForm((prev) => ({ ...prev, 
            municipio: response.data.localidade,
            uf: response.data.uf,
            endereco: response.data.logradouro + ', ' + response.data.bairro + '. ' + response.data.cep + ' ' + response.data.localidade + ' - ' + response.data.uf
          }))
        } else {
          console.log('Nenhum valor encontrado')
        }
      })
    };
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
      <h1 className="text-lg w-full px-2">Cadastrar Escolas</h1>
      <div className='flex flex-wrap gap-x-4 p-2 w-full'>
        <EleInput 
            label='Nome da Escola'
            type='text'
            name='nome'
            value={form.nome}
            onChange={handleChangeForm}
        />
        <EleInput 
            label='Categoria Administrativa'
            type='select'
            name='categoria_administrativa'
            value={form.categoria_administrativa}
            onChange={handleChangeForm}
            data={categoriaAdministrativa}
            size='w-1/2'
        />
        <EleInput 
            label='Etapa de Ensino'
            type='select'
            name='etapa_ensino'
            value={form.etapa_ensino}
            onChange={handleChangeForm}
            data={etapaEnsino}
            size='w-1/2'
        />
        <EleInput 
            label='Código do INEP'
            type='text'
            name='inep_codigo'
            value={form.inep_codigo}
            onChange={handleChangeForm}
            size='w-1/2'
        />
        <EleInput 
            label='CEP'
            type='text'
            name='cep'
            value={form.cep}
            onChange={handleChangeForm}
            size='w-1/2'
        />
        <EleInput 
            label='Município'
            type='text'
            name='municipio'
            value={form.municipio}
            size='w-1/2'
            disabled
        />
        <EleInput 
            label='Unidade Federal'
            type='text'
            name='uf'
            value={form.uf}
            size='w-1/2'
            disabled
        />
        <EleInput 
            label='Endereço'
            type='text'
            name='endereco'
            value={form.endereco}
            disabled
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

export default ModEditEsc
