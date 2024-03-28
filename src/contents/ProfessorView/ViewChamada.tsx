import { EleAlert, EleButton, EleInput, EstModal } from '@/components'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cadAlunoTurma, cadTurma, dataAluno, dataFrequencia, dataSala, dataTurma, horario, propSelect } from '@/interface'
import { formatDate, formatShortDate } from '@/lib/utils'
import api from '@/service/api'
import React from 'react'
import { QrReader } from 'react-qr-reader'
import uuid from 'react-uuid'

interface propsPresenca {
  matricula: string,
  nome: string,
  presente: boolean
}

const presenca:propsPresenca[] = [
  { matricula: '001', nome: "Prof. Silva", presente: false},
  { matricula: '002', nome: "Profa. Oliveira", presente: false},
  { matricula: '003', nome: "Prof. Santos", presente: true},
  { matricula: '004', nome: "Profa. Lima", presente: false},
  { matricula: '005', nome: "Prof. Pereira", presente: true},
  { matricula: '006', nome: "Profa. Costa", presente: false},
  { matricula: '007', nome: "Prof. Martins", presente: false},
  { matricula: '008', nome: "Profa. Almeida", presente: true},
]

interface mapAluno {
  aluno_turmas_uuid: string
  chamada: boolean
  created_at: string
  data: string
  updated_at: string | null
  uuid: string
  matricula: string
  nome: string
}

const ViewChamada = () => {
  const [reviewPresenca, setReviewPresenca] = React.useState<Boolean>(false)
  const [currentDate, setCurrentDate] = React.useState<string>('')
  const [presentData, setPresentData] = React.useState<propsPresenca[]>(presenca)
  const [data, setData] = React.useState<string>('No result')
  const [openModal, setOpenModal] = React.useState<boolean>(false)
  const [turma, setTurma] = React.useState<boolean>(false)
  const [turmas, setTurmas] = React.useState<cadTurma[]>([])
  const [turmaSelect, setTurmaSelect] = React.useState<cadTurma>({
    created_at: '',
    disciplina: '',
    horario: [],
    nome_professor: '',
    sala: '',
    updated_at: '',
    uuid: ''
  })
  const [alunos, setAlunos] = React.useState<mapAluno[]>([])
  const [salas, setSalas] = React.useState<dataSala[]>([])

  const [alert, setAlert] = React.useState<boolean>(false)
  const [exit, setExit] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState<string>('')

  const diaSemana:propSelect[] = [
    { name: 'segunda', uuid: '1' },
    { name: 'terça', uuid: '2' },
    { name: 'quarta', uuid: '3' },
    { name: 'quinta', uuid: '4' },
    { name: 'sexta', uuid: '5' }
  ]

  const date = new Date

  const handleTurmas = async () => {
    const dataUser = localStorage.getItem('@aplication/aoponto')
    if (dataUser) {
      const tempUser = JSON.parse(dataUser)
      try {
        const response = await api.get('/turmas', { params: { all: true, attribute: 'nome_professor', value: tempUser.user.nome }})
        if (response) {
          const tempData:cadTurma[] = []
          response.data.map((item:dataTurma) => {
            tempData.push({...item,
              horario: JSON.parse(item.horario.replace(/'/g, '"'))
            })
          })
          setTurmas(tempData)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleSalas = async () => {
    const dataUser = localStorage.getItem('@aplication/aoponto')
    if (dataUser) {
      const tempUser = JSON.parse(dataUser)
      try {
        const response = await api.get('/salas', { params: { all: true, attribute: 'escola_uuid', value: tempUser.user.escola_uuid }})
        if(response) {
          setSalas(response.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleAlunos = async (ele: cadTurma) => {
    try {
      const response = await api.get('/aluno-turmas', { params: {
        all: true, attribute: 'turma_uuid', value: ele.uuid
      }})
      const alunosDaTurma: mapAluno[] = []
      response.data.map( async (item: cadAlunoTurma) => {
        const resp = await api.get('/alunos', { params: {
          all: false, attribute: 'uuid', value: item.aluno_uuid
        }})
        alunosDaTurma.push({
          aluno_turmas_uuid: item.uuid,
          chamada: false,
          created_at: formatDate(date),
          data: currentDate,
          updated_at: null,
          uuid: uuid(),
          matricula: resp.data.matricula.toString(),
          nome: resp.data.nome
        })
      })
      setAlunos(alunosDaTurma)
      console.log(alunosDaTurma)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async () => {
    const horarios: horario[] = []
    turmaSelect.horario.map((item: horario) => {
      if (item.dia === date.getDay().toString()) {
        horarios.push(item)
      }
    })
    try {
      horarios.map(i => {
        alunos.map(async item => {
          console.log(item.data)
          const update: dataFrequencia = {
            aluno_turmas_uuid: item.aluno_turmas_uuid,
            chamada: item.chamada,
            created_at: item.created_at,
            data: item.data,
            hora: i.hora,
            updated_at: item.updated_at,
            uuid: item.uuid,
          }
          await api.post('/frequencias', update )
        })
      })
      setMessage('Frequencia Submetida')
      setAlert(true)
      setTurma(false)
      setReviewPresenca(false)
    } catch (error) {
      console.log(error)
    }
  }

  const validTurmaDay = async (ele: cadTurma) => {
    try {
      const response = await api.get('/aluno-turmas', { params: { all: true, attribute: 'turma_uuid', value: ele.uuid }})
      const resp = await api.get('/frequencias', { params: { all: true, attribute: 'aluno_turmas_uuid', value: response.data[0].uuid }})
      if (resp.data.filter((item: dataFrequencia) => item.data === currentDate).length !== 0) {
        return false
      } else {
        return true
      }
    } catch (error) {
      console.log(error)
      return false
    }
  }


  const alertAction = () => {
    if(exit) {
      setAlert(false)
    } else {
      setAlert(false)
    }
  }

  React.useEffect(()=>{
    handleTurmas()
    handleSalas()
  },[])

  React.useEffect(() => {
    const getCurrentDate = () => {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
    setCurrentDate(getCurrentDate())
  }, [])
  

  return (
  <>
    {turma ? (
      <>
      <EleButton onClick={() => {
        setTurma(false)
        setReviewPresenca(false)
      }}>Voltar a Seleção de Turma</EleButton>
        {reviewPresenca ? (
          <>
          <EleInput 
            label='Data de Hoje' 
            type='date' 
            value={currentDate} 
            name='data'
          />
          <div className='p-2 w-full'>
            <Table>
              <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Matricula</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Presença</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                {alunos.map((element) => {
                return (
                  <TableRow onClick={() => {}} className={`${element.chamada ? 'bg-green-200' : 'bg-red-200'} relative`} key={element.matricula}>
                      <input 
                          className='w-full absolute opacity-0 h-full'
                          type='checkbox' 
                          id={element.matricula}
                          defaultChecked={element.chamada ? true : false}
                          onChange={() => {
                            const newArray = alunos.map(aluno => {
                              if (aluno.uuid === element.uuid) {
                                return {...aluno, chamada: !aluno.chamada}
                              }
                              return aluno
                            })
                            setAlunos(newArray)
                          }}
                      />
                      <TableCell>{element.matricula}</TableCell>
                      <TableCell>{element.nome}</TableCell>
                      {element.chamada ? (<TableCell>Presente</TableCell>) : (<TableCell>Ausente</TableCell>)}
                  </TableRow>
                )
                })}
              </TableBody>
            </Table>
          </div>
          <EleButton onClick={handleSubmit}>Submeter Chamada</EleButton>
          </>
        ) : (
          <>
            <QrReader
                onResult={(result) => {
                    if (!!result) {
                    setData(result?.getText());
                    setOpenModal(true)
                    }
                }}
                constraints={{facingMode : 'user'}}
                className='max-w-[500px] w-full m-auto'
            />
            <EstModal confirm={() => {
                const newArray = alunos.map(aluno => {
                  if (aluno.matricula === data) {
                    return {...aluno, chamada: true}
                  }
                  return aluno
                })
                setAlunos(newArray)
                setOpenModal(false)
            }} exit={()=> setOpenModal(false)} open={openModal}>
                {alunos.map((ele) => {
                    if (ele.matricula === data) {
                        return (
                            <div className='p-8'>
                            <p className='text-2xl text-center w-full'>Nome: {ele.nome}</p>
                            <p className='text-2xl text-center w-full'>Matricula: {ele.matricula}</p>
                            </div>
                        )
                    }
                }, [data])}
            </EstModal>
          </>
        )}
          <EleButton onClick={()=> {
              setReviewPresenca(!reviewPresenca)
              console.log(presentData)
              }}>{reviewPresenca ? 'Voltar' : 'Revisar'}</EleButton>
      </>
    ) : (
    <>
      {turmas.length === 0 || salas.length === 0 ? (
        <p className='text-center w-full'>Aguarde alguns instantes...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Disciplinas</TableHead>
              <TableHead>Série</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {turmas.map((element) => (
              <>
                <TableRow onClick={async () => {
                  if (element.horario.some(item => item.dia === date.getDay().toString())) {
                    if (await validTurmaDay(element)) {
                      setTurmaSelect(element)
                      setTurma(true)
                      handleAlunos(element)
                    } else {
                      setMessage('Você já cadastrou a frequencia dessa turma hoje')
                      setAlert(true)
                    }
                  } else {
                    setMessage('Você não dará aula dessa matéria hoje')
                    setAlert(true)
                  }
                }} key={element.uuid}>
                  <TableCell>{element.disciplina}</TableCell>
                  <TableCell>{salas.find(item => item.uuid === element.sala)?.nome + ' - ' + salas.find(item => item.uuid === element.sala)?.ano}</TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      )}
    </>
    )}
    <EleAlert 
      message={message}
      open={alert}
      setAlert={alertAction}/>
  </>
  )
}

export default ViewChamada