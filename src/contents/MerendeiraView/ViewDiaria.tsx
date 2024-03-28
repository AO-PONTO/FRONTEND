import { EleAlert, EleButton, EleInput } from '@/components'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cadAlunoTurma, cadRelatMer, dataAluno, dataCardEsc, dataFrequencia, dataSala, dataTurma } from '@/interface'
import { formatDate } from '@/lib/utils'
import api from '@/service/api'
import React from 'react'
import uuid from 'react-uuid'

const ViewDiaria = () => {

  const getDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const date = new Date
  const [alunos, setAlunos] = React.useState<number>(0)

  const [diariaView, setDiariaView] = React.useState<string>('inicial')
  const [currentDate, setCurrentDate] = React.useState<string>('')
  const [cardapios, setCardapios] = React.useState<dataCardEsc[]>([])
  const [cardapio, setCardapio] = React.useState<dataCardEsc | undefined>({
    cardapio_descricao:'',
    cardapio_name:'',
    cardapio_uuid:'',
    created_at:'',
    dia_da_semana:'',
    escola_uuid:'',
    turno:'',
    updated_at:'',
    uuid:''
  })
  const [relatorio, setRelatorio] = React.useState<cadRelatMer>({
    created_at: formatDate(date),
    data: getDate(),
    escola_name: '',
    escola_uuid: '',
    numero_alunos: alunos.toString(),
    sobra_limpa: '',
    sobra_suja: '',
    updated_at: null,
    uuid: uuid()
  })
  const dias:string[] = ['', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', '']

  const [alert, setAlert] = React.useState<boolean>(false)
  const [exit, setExit] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState<string>('')

  const getCurrentDate = async () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    setCurrentDate(`${year}-${month}-${day}`)
    const dataUser = localStorage.getItem('@aplication/aoponto')
    if (dataUser) {
        const tempUser = JSON.parse(dataUser)
        try {
            const response = await api.get('/cardapio-escola/', { params: { all: true, attribute: 'escola_uuid', value: tempUser.user.escola_uuid } })
            const data: dataCardEsc[] = response.data
            setCardapios(data)
            setCardapio(data.find(item => item.dia_da_semana === dias[today.getDay()]))
        } catch (error) {
            setMessage('Erro no servidor, tente novamente')
            setAlert(true)
            console.log(error)
        }
    } else {

    }
  }

  const handleSubmit = async () => {
    const dataUser = localStorage.getItem('@aplication/aoponto')
    if (dataUser) {
        const tempUser = JSON.parse(dataUser)
        let updatedForm = { ...relatorio,
          escola_uuid: tempUser.user.escola_uuid,
          escola_name: tempUser.user.escola_name,
        }
        if(updatedForm.data === '' ||
        updatedForm.numero_alunos === '' ||
        updatedForm.sobra_limpa === '' ||
        updatedForm.sobra_suja === ''){
            setMessage('Preencha todos os campos corretamente')
            setAlert(true)
        } else {
            try {
              await api.post('/relatorio-merendeiras/', updatedForm)
              setMessage('Relatório enviado com sucesso!')
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

  const handleAlunosNumber = async () => {
    const dataUser = localStorage.getItem('@aplication/aoponto')
    if (dataUser) {
      const tempUser = JSON.parse(dataUser)
      const horario = `${date.getHours()}:${date.getMinutes()}`
      const data1 = new Date(`2000-01-01T${horario}`)
      const dataMatutino = new Date(`2000-01-01T12:00`)
      const dataVespertino = new Date(`2000-01-01T18:00`)
      const dataNoturno = new Date(`2000-01-01T23:00`)
      if(data1 < dataMatutino) {
        //matutino
        try {
          const dataTurmas: dataTurma[] = []
          const dataAlunos: cadAlunoTurma[] = []
          let dataPresentes: number = 0
          const string = `{'dia': '${date.getDay()}', 'hora': '07'}`
          let response = await api.get('/salas', { params: { all: true, attribute: 'escola_uuid', value: tempUser.user.escola_uuid }})
          const dataSalas = response.data.filter((item: { turno: string }) => item.turno === 'matutino')
          await Promise.all(dataSalas.map(async (item: dataSala) => {
            response = await api.get('/turmas', { params: { all: true, attribute: 'sala', value: item.uuid }})
            response.data.map((item: dataTurma) => {
              if(item.horario.includes(string)) {
                dataTurmas.push(item)
              }
            })
          }))
          await Promise.all(dataTurmas.map(async (item: dataTurma) => {
            response = await api.get('/aluno-turmas', { params: { all: true, attribute: 'turma_uuid', value: item.uuid }})
            response.data.map((item: cadAlunoTurma) => {
              dataAlunos.push(item)
            })
          }))
          await Promise.all(dataAlunos.map(async (item: cadAlunoTurma) => {
            response = await api.get('/frequencias', { params: { all: true, attribute: 'aluno_turmas_uuid', value: item.uuid}})
            const data = response.data.find((i:dataFrequencia) => i.data === getDate() && i.hora === '07')
            if(data) {
              dataPresentes = dataPresentes + 1
            }
          }))
          setAlunos(dataPresentes)
        } catch (error) {
          console.log(error)
        }
      } else if (dataMatutino < data1 && data1 < dataVespertino) {
        //vespertino
        try {
          const dataTurmas: dataTurma[] = []
          const dataAlunos: cadAlunoTurma[] = []
          let dataPresentes: number = 0
          const string = `{'dia': '${date.getDay()}', 'hora': '13'}`
          let response = await api.get('/salas', { params: { all: true, attribute: 'escola_uuid', value: tempUser.user.escola_uuid }})
          const dataSalas = response.data.filter((item: { turno: string }) => item.turno === 'vespertino')
          await Promise.all(dataSalas.map(async (item: dataSala) => {
            response = await api.get('/turmas', { params: { all: true, attribute: 'sala', value: item.uuid }})
            response.data.map((item: dataTurma) => {
              if(item.horario.includes(string)) {
                dataTurmas.push(item)
              }
            })
          }))
          await Promise.all(dataTurmas.map(async (item: dataTurma) => {
            response = await api.get('/aluno-turmas', { params: { all: true, attribute: 'turma_uuid', value: item.uuid }})
            response.data.map((item: cadAlunoTurma) => {
              dataAlunos.push(item)
            })
          }))
          await Promise.all(dataAlunos.map(async (item: cadAlunoTurma) => {
            response = await api.get('/frequencias', { params: { all: true, attribute: 'aluno_turmas_uuid', value: item.uuid}})
            const data = response.data.find((i:dataFrequencia) => i.data === getDate() && i.hora === '13')
            if(data) {
              dataPresentes = dataPresentes + 1
            }
          }))
          setAlunos(dataPresentes)
        } catch (error) {
          console.log(error)
        }
      } else if (dataVespertino < data1 && data1 < dataNoturno) {
        //noturno
        try {
          const dataTurmas: dataTurma[] = []
          const dataAlunos: cadAlunoTurma[] = []
          let dataPresentes: number = 0
          const string = `{'dia': '${date.getDay()}', 'hora': '19'}`
          let response = await api.get('/salas', { params: { all: true, attribute: 'escola_uuid', value: tempUser.user.escola_uuid }})
          const dataSalas = response.data.filter((item: { turno: string }) => item.turno === 'noturno')
          await Promise.all(dataSalas.map(async (item: dataSala) => {
            response = await api.get('/turmas', { params: { all: true, attribute: 'sala', value: item.uuid }})
            response.data.map((item: dataTurma) => {
              if(item.horario.includes(string)) {
                dataTurmas.push(item)
              }
            })
          }))
          await Promise.all(dataTurmas.map(async (item: dataTurma) => {
            response = await api.get('/aluno-turmas', { params: { all: true, attribute: 'turma_uuid', value: item.uuid }})
            response.data.map((item: cadAlunoTurma) => {
              dataAlunos.push(item)
            })
          }))
          await Promise.all(dataAlunos.map(async (item: cadAlunoTurma) => {
            response = await api.get('/frequencias', { params: { all: true, attribute: 'aluno_turmas_uuid', value: item.uuid}})
            const data = response.data.find((i:dataFrequencia) => i.data === getDate() && i.hora === '19')
            if(data) {
              dataPresentes = dataPresentes + 1
            }
          }))
          setAlunos(dataPresentes)
        } catch (error) {
          console.log(error)
        }
      }
    }
  }


  const alertAction = () => {
    if(exit) {
      setAlert(false)
      setDiariaView('inicial')
    } else {
      setAlert(false)
    }
  }

  const handleChangeForm = (value: string, label: string) => {
    setRelatorio((prev) => ({ ...prev, 
      [label]: value
    }))
  }

  React.useEffect(() => {
    getCurrentDate()
    handleAlunosNumber()
  }, []);

  return (
    <>
    {diariaView === 'relatorio' ? (
        <>
            <div className='flex flex-wrap gap-x-4 p-2 w-full'>
            <EleInput label='Dia de Hoje' type='date' value={relatorio.data} name='data' onChange={handleChangeForm} size='w-1/2'/>
            <EleInput label='Numero de Alunos' type='number' value={relatorio.numero_alunos} name='numero_alunos' onChange={handleChangeForm} size='w-1/2'/>
            <EleInput label='Sobra Limpa em Kg' type='number' value={relatorio.sobra_limpa} name='sobra_limpa' onChange={handleChangeForm} size='w-1/2'/>
            <EleInput label='Sobra Suja em Kg' type='number' value={relatorio.sobra_suja} name='sobra_suja' onChange={handleChangeForm} size='w-1/2'/>
            </div>
            <div className='flex w-full flex-col md:flex-row'>
            <EleButton onClick={handleSubmit}>Submeter</EleButton>
            <EleButton onClick={() => setDiariaView('inicial')}>Voltar</EleButton>
            </div>
        </>
    ): diariaView === 'inicial' ? (
        <>
            <EleInput label='Dia de Hoje' type='date' value={currentDate} disabled={true} name='dia'/>
            <EleInput label='Prato do dia' type='text' value={cardapio?.cardapio_name} disabled={true} name='prato'/>
            <div className='flex w-full flex-col md:flex-row'>
            <EleButton onClick={() => setDiariaView('prato')}>Ver Detalhes do Prato</EleButton>
            <EleButton onClick={() => setDiariaView('semana')}>Ver Pratos da Semana</EleButton>
            </div>
            <h1 className='text-center text-2xl py-4 w-full'>Alunos Contabilizados Hoje:</h1>
            <h1 className='text-center text-6xl font-semibold pb-4 w-full'>{alunos}</h1>
            <EleButton onClick={() => setDiariaView('relatorio')}>Preencher Relatorio do Dia</EleButton>
        </>
    ): diariaView === 'prato' ? (
      <>
        <p className='w-full p-2 text-xl'>{cardapio?.cardapio_name}:</p>
        <p className='w-full px-2'>{cardapio?.cardapio_descricao}</p>
        <EleButton onClick={() => setDiariaView('inicial')}>Voltar</EleButton>
      </>
    ): diariaView === 'semana' ? (
        <>
        <Table className='w-full'>
            <TableHeader>
            <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Turno</TableHead>
                <TableHead>Dia da Semanas</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {cardapios.map((ele) => (
                <>
                <TableRow key={ele.uuid}>
                <TableCell>{ele.cardapio_name}</TableCell>
                <TableCell>{ele.turno}</TableCell>
                <TableCell>{ele.dia_da_semana}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell colSpan={2}>{ele.cardapio_descricao}</TableCell>
                </TableRow>
                </>
            ))}
            </TableBody>
        </Table>
          <EleButton onClick={() => setDiariaView('inicial')}>Voltar</EleButton>
        </>
      ): (<></>)}

    <EleAlert
        message={message}
        open={alert}
        setAlert={alertAction}/>
    </>
  )
}

export default ViewDiaria