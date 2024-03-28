import { EleButton, EleInput, EleAlert } from '@/components'
import { cadTurma, dataSala, dataTurma, dataUser, horario, propSelect, propsView } from '@/interface'
import api from '@/service/api'
import { formatDate, stringNumber } from '@/lib/utils'
import uuid from 'react-uuid'
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FaTrashAlt } from 'react-icons/fa'
import TableHorarios from './TableHorarios'
import TableHorariosEdit from './TableHorariosEdit'

interface Module {
  form: dataTurma,
  setView: React.Dispatch<React.SetStateAction<string>>,
  reset?: Function
}

const ModEditTurma = (props: Module) => {

  const diaSemana:propSelect[] = [
    { name: 'segunda', uuid: '1' },
    { name: 'terça', uuid: '2' },
    { name: 'quarta', uuid: '3' },
    { name: 'quinta', uuid: '4' },
    { name: 'sexta', uuid: '5' }
  ]

  const date = new Date

  const [form, setForm] = React.useState<cadTurma>({...props.form,
    horario: JSON.parse(props.form.horario.replace(/'/g, '"'))
  })
  const [disciplinas, setDisciplinas] = React.useState<propSelect[]>([])
  const [salas, setSalas] = React.useState<propSelect[]>([])
  const [dataSalas, setDataSalas] = React.useState<dataSala[]>([])
  const [dataSala, setDataSala] = React.useState<dataSala | undefined>()
  const [professores, setProfessores] = React.useState<propSelect[]>([])
  const [alert, setAlert] = React.useState<boolean>(false)
  const [exit, setExit] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState<string>('')
  const [horarios, setHorarios] = React.useState<propSelect[]>(
  )
  const [formHorarios, setFormHorarios] = React.useState<horario[]>(form.horario)
  const [formHorario, setFormHorario] = React.useState<horario>({
    dia: '',
    hora: ''
  })
  const [destroy, setDestroy] = React.useState<boolean>(false)
  const [constroi, setConstroi] = React.useState(true)
  const [turmas, setTurmas] = React.useState<cadTurma[]>([])

  const handleChangeForm = (value: string, label: string) => {
    setForm((prev) => ({ ...prev, 
      [label]: value
    }))
  }

  const handleChangeFormHorario = (value: string, label: string) => {
    setFormHorario((prev) => ({ ...prev,
      [label]: value
    }))
  }

  const handleGet = async () => {
    const dataUser = localStorage.getItem('@aplication/aoponto')
    if (dataUser) {
      const tempUser = JSON.parse(dataUser)
      try {
        let response = await api.get('/disciplinas', { params: { all: true } })
        if (response) {
          const temp = response.data.map((item: { name: any }) => {
            return {
              uuid: item.name,
              name: item.name
            }
          })
          setDisciplinas(temp)
        }
        response = await api.get('/salas', { params: { all: true, attribute: "escola_uuid", value: tempUser.user.escola_uuid } })
        if (response) {
          const temp = response.data.map((item: { nome: any, uuid: any }) => {
            return {
              uuid: item.uuid,
              name: item.nome
            }
          })
          setSalas(temp)
          setDataSalas(response.data)
          const room = response.data.find((item: { uuid: string }) => item.uuid === form.sala)
          setDataSala(room)
          if(room) { 
            if(room?.turno === 'matutino') {
              setHorarios([
                { name: '07:00 - 08:00', uuid: '07' },
                { name: '08:00 - 09:00', uuid: '08' },
                { name: '09:00 - 10:00', uuid: '09' },
                { name: '10:00 - 11:00', uuid: '10' },
              ])
            } else if(room?.turno === 'vespertino') {
              setHorarios([
                { name: '13:00 - 14:00', uuid: '13' },
                { name: '14:00 - 15:00', uuid: '14' },
                { name: '15:00 - 16:00', uuid: '15' },
                { name: '16:00 - 17:00', uuid: '16' },
              ])
            } else if(room?.turno === 'noturno') {
              setHorarios([
                { name: '19:00 - 20:00', uuid: '19' },
                { name: '20:00 - 21:00', uuid: '20' },
                { name: '21:00 - 22:00', uuid: '21' },
                { name: '22:00 - 23:00', uuid: '22' },
              ])
            }
          }
        }
        response = await api.get('/usuario', { params: { all: true, attribute: "escola_uuid", value: tempUser.user.escola_uuid } })
        if (response) {
          let tempResponse: dataUser[] = response.data
          tempResponse = tempResponse.filter(item => item.access_level === 2)
          const temp = tempResponse.map(item => {
            return {
              uuid: item.nome,
              name: item.nome
            }
          })
          setProfessores(temp)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleSubmit = async () => {
    let updatedForm = { ...form,
      horario: JSON.stringify(formHorarios),
      updated_at: date
    }
    if(updatedForm.disciplina === '' ||
      updatedForm.nome_professor === '' ||
      updatedForm.sala === '' ||
      updatedForm.horario.length === 0 ) {
      setMessage('Preencha todos os campos corretamente')
      setAlert(true)
    } else {
      const horariosCadastrados: horario[] = []
      turmas.filter(obj => obj.disciplina !== form.disciplina).map(item => {
        return item.horario.map(i => horariosCadastrados.push(i))
      })
      if(horariosCadastrados.some(obj1 => {
        return formHorarios.some(obj2 => obj1.dia === obj2.dia && obj1.hora === obj2.hora)
      })) {
        setMessage('Horário requisitado já possui turma')
        setAlert(true)
      } else {
        try {
          await api.put('/turmas/', updatedForm, { params: { uuid: form.uuid }})
          setMessage('Turma editada com sucesso!')
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

  const alertAction = () => {
    if(exit) {
      setAlert(false)
      props.setView('Listar')
    } else {
      setAlert(false)
    }
  }

  const handleDef = () => {
        const periodo = dataSalas.find(item => item.uuid === form.sala)
        if(periodo) { 
          setDataSala(periodo)
          if(periodo?.turno === 'matutino') {
            setHorarios([
              { name: '07:00 - 08:00', uuid: '07' },
              { name: '08:00 - 09:00', uuid: '08' },
              { name: '09:00 - 10:00', uuid: '09' },
              { name: '10:00 - 11:00', uuid: '10' },
            ])
          } else if(periodo?.turno === 'vespertino') {
            setHorarios([
              { name: '13:00 - 14:00', uuid: '13' },
              { name: '14:00 - 15:00', uuid: '14' },
              { name: '15:00 - 16:00', uuid: '15' },
              { name: '16:00 - 17:00', uuid: '16' },
            ])
          } else if(periodo?.turno === 'noturno') {
            setHorarios([
              { name: '19:00 - 20:00', uuid: '19' },
              { name: '20:00 - 21:00', uuid: '20' },
              { name: '21:00 - 22:00', uuid: '21' },
              { name: '22:00 - 23:00', uuid: '22' },
            ])
          }
      }
    }

  React.useEffect(() => {
    handleGet()
  }, [])

  React.useEffect(() => {
    setConstroi(false)
    setConstroi(true)
  }, [destroy])

  return (
    <>
      <h1 className='text-lg w-full px-2'>Editar Turma</h1>
      <div className='flex flex-wrap gap-x-4 p-2 w-full'>
        <EleInput 
          label='Professor'
          type='select'
          data={professores}
          name='nome_professor'
          value={form.nome_professor}
          onChange={handleChangeForm}
          disabled
        />
        <EleInput 
          label='Disciplina'
          type='select'
          data={disciplinas}
          size='w-1/2'
          name='disciplina'
          value={form.disciplina}
          onChange={handleChangeForm}
          disabled
        />
        <EleInput 
          label='Série'
          type='select'
          data={salas}
          size='w-1/2'
          name='sala'
          value={form.sala}
          onChange={handleChangeForm}
          disabled
        />
        <div className='border-b my-2 border-gray-400 border-solid w-full'></div>
        {formHorarios.length !== 0 && constroi && (
          <>
          <Table className='w-full'>
            <TableHeader>
              <TableRow>
                <TableHead className='w-5'>Ações</TableHead>
                <TableHead className='text-center'>Dia</TableHead>
                <TableHead className='text-center'>Hora</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formHorarios.map((ele) => (
                <TableRow key={ele.dia + ele.hora}>
                  <TableCell><FaTrashAlt onClick={() => {
                    const temp = formHorarios.filter(item => item !== ele)
                    setFormHorarios(temp)
                    setDestroy(!destroy)
                  }} /></TableCell>
                  <TableCell className='text-center'>{diaSemana.find(item => item.uuid === ele.dia)?.name}</TableCell>
                  <TableCell className='text-center'>{ele.hora}:00</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </>
        )}
        <EleInput 
          label='Dia da Semana'
          type='select'
          data={diaSemana}
          size='w-1/2'
          name='dia'
          value={formHorario.dia}
          onChange={handleChangeFormHorario}
        />
        <EleInput 
          label='Horário'
          type='select'
          data={horarios}
          size='w-1/2'
          name='hora'
          value={formHorario.hora}
          onChange={handleChangeFormHorario}
        />
        <div className="flex w-full">
          <EleButton onClick={() => {
            if(formHorario.dia === '' || formHorario.hora === ''){
              setMessage('Preencha todos os campos corretamente')
              setAlert(true)
            } else {
              formHorarios.push(formHorario)
              setFormHorario({
                dia: '',
                hora: ''
              })
            }
          }}>Adicionar Horários</EleButton>
        </div>
        {dataSala && (<TableHorariosEdit data={dataSala} disciplina={form.disciplina} setTurmas={setTurmas}/>)}
        
        <div className='w-full flex'>
          <EleButton onClick={() => props.setView('Listar')}>Cancelar</EleButton>
          <EleButton onClick={handleSubmit}>Editar</EleButton>
        </div>
        <EleAlert 
          message={message}
          open={alert}
          setAlert={alertAction}/>
      </div>
    </>
  )
}

export default ModEditTurma