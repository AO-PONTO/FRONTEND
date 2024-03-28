import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cadTurma, dataSala, dataTurma, propSelect } from '@/interface'
import api from '@/service/api'
import React from 'react'

const ViewTurmas = () => {
  const [turmas, setTurmas] = React.useState<cadTurma[]>([])
  const [salas, setSalas] = React.useState<dataSala[]>([])

  const diaSemana:propSelect[] = [
    { name: 'segunda', uuid: '1' },
    { name: 'terça', uuid: '2' },
    { name: 'quarta', uuid: '3' },
    { name: 'quinta', uuid: '4' },
    { name: 'sexta', uuid: '5' }
  ]

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

  React.useEffect(()=>{
    handleTurmas()
    handleSalas()
  },[])

  return (
  <>
    <h1 className="text-lg mb-2">Minhas Turmas</h1>
    {turmas.length === 0 || salas.length === 0 ? (
      <p className='text-center w-full'>Aguarde alguns instantes...</p>
    ) : (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Disciplinas</TableHead>
            <TableHead>Série</TableHead>
            <TableHead>Dias</TableHead>
            <TableHead >Horarios</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {turmas.map((element) => (
          <TableRow key={element.uuid}>
            <TableCell>{element.disciplina}</TableCell>
            <TableCell>{salas.find(item => item.uuid === element.sala)?.nome + ' - ' + salas.find(item => item.uuid === element.sala)?.ano}</TableCell>
            <TableCell>{element.horario.map(ele=><p key={ele.dia + ele.hora}>{diaSemana.find(item => item.uuid === ele.dia)?.name}</p>)}</TableCell>
            <TableCell>{element.horario.map(ele=><p key={ele.dia + ele.hora}>{ele.hora}:00</p>)}</TableCell>
          </TableRow>
          ))}
        </TableBody>
      </Table>
    )}
  </>
  )
}

export default ViewTurmas