import { EleAlert, EleButton, EleInput } from '@/components'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { cadAlunoTurma, dataTurma, papelRequest, propSelect, propsView } from '@/interface'
import { formatDate } from '@/lib/utils'
import api from '@/service/api'
import React from 'react'
import { IoMdTime } from 'react-icons/io'
import uuid from 'react-uuid'

const ViewComporTurma = (props: propsView) => {

  const date = new Date

  const [salas, setSalas] = React.useState<propSelect[]>([])
  const [sala, setSala] = React.useState<string>('')
  const [alunos, setAlunos] = React.useState<propSelect[]>([])
  const [aluno, setAluno] = React.useState<string>('')
  const [listaAlunos, setListaAlunos] = React.useState<propSelect[]>([])
  const [turmas, setTurmas] = React.useState<dataTurma[]>([])

  const [alert, setAlert] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState<string>('')
  const [exit, setExit] = React.useState<boolean>(false)
  const [load, setLoad] = React.useState<boolean>(false)

  const handleChangeSala = async (value: string, label: string) => {
    setSala(value)
    try {
      const response = await api.get('/turmas', {params: { all: true, attribute: 'sala', value: value}})
      setTurmas(response.data)
    } catch(err) {
      console.log(err)
    }
  }

  const handleChangeAlunos = (value: string, label: string) => {
    if (value !== ''){
      setAluno(value)
      const todosAlunos = listaAlunos
      const addAluno = alunos.find(item => item.uuid === value)
      if(addAluno) {
        !todosAlunos.some(item => item === addAluno) && todosAlunos.push(addAluno)
        setListaAlunos(todosAlunos)
      }
    }
  }

  const handleGet = async () => {
    const dataUser = localStorage.getItem('@aplication/aoponto')
    if (dataUser) {
      const tempUser = JSON.parse(dataUser)
      try {
        let response = await api.get('/salas', { params: { all: true, attribute: 'escola_uuid', value: tempUser.user.escola_uuid }})
        let temp = response.data.map((item: { uuid: any; nome: any }) => {
          return {
            uuid: item.uuid,
            name: item.nome
          }
        })
        setSalas(temp)
        response = await api.get('alunos', { params: { all: true, attribute: 'escola_uuid', value: tempUser.user.escola_uuid }})
        temp = response.data.map((item: { uuid: any; nome: any }) => {
          return {
            uuid: item.uuid,
            name: item.nome
          }
        })
        setAlunos(temp)
      } catch(error) {

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

  const handleSubmit = async () => {
    setLoad(true)
    turmas.map(async (i) => {
      try {
        const requisit = await api.get('/aluno-turmas', { params: { all: true, attribute: 'turma_uuid', value: i.uuid }})
        if (requisit.data.length !== 0) {
          setMessage(`Erro ao cadastrar alunos na disciplina '${i.disciplina} desta turma'!`)
          setAlert(true)
        } else {
          if(sala === '' || aluno === '') {
            setMessage('Preencha todos os campos corretamente')
            setAlert(true)
          } else {
            listaAlunos.map(async item => {
              const upForm:cadAlunoTurma = {
                aluno_uuid: item.uuid,
                created_at: formatDate(date),
                turma_name: salas.find(item => item.uuid === i.sala)?.name + ' - ' + i.disciplina,
                turma_uuid: i.uuid,
                updated_at: '',
                uuid: uuid()
              }
              try {
                await api.post('/aluno-turmas', upForm)
              } catch(err) {
                console.log(err)
              }
            })
          }
        }
      } catch (error) {
        console.log(error)
      }
    })
    setLoad(false)
    setMessage('Atribuições realizadas com sucesso!')
    setAlert(true)
    setExit(true)
  }

  React.useEffect(() => {
    handleGet()
  }, [])

  return (
    <>
      <h1 className='text-lg w-full px-2'>Compor Turmas</h1>
      <div className='flex flex-wrap gap-x-4 p-2 w-full'>
        <EleInput 
          label='Série'
          type='select'
          data={salas}
          name='sala'
          value={sala}
          onChange={handleChangeSala}
        />
        <div className='flex flex-wrap w-full'>
          {listaAlunos.map((item) => (
            <div className='w-1/3 p-2 border-b' key={item.uuid}>{item.name}</div>
          ))}
        </div>
        <EleInput 
          label='Alunos'
          type='select'
          data={alunos}
          name='ano'
          value={aluno}
          onChange={handleChangeAlunos}
        />
      </div>
      <EleButton onClick={handleSubmit}>Compor Turmas</EleButton>
      <EleAlert 
        message={message}
        open={alert}
        setAlert={alertAction}/>
      {load && (
        <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-[calc(100%-20px)] sm:w-1/2 md:w-1/3 lg:w-1/4 rounded-lg bg-white p-12 text-center">
            <IoMdTime size={60} className='m-auto mb-5' />
            Aguarde
          </div>
        </div>
      )}
    </>
  )
}

export default ViewComporTurma