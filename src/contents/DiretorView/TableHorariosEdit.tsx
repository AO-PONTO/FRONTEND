import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cadTurma, dataSala, dataTurma, horario } from '@/interface'
import api from '@/service/api'
import React from 'react'

interface propsTableHorarios {
    data: dataSala,
    disciplina: string,
    setTurmas: React.Dispatch<React.SetStateAction<cadTurma[]>>
}

const TableHorariosEdit = (props:propsTableHorarios) => {

  const [turmas, setTurmas] = React.useState<cadTurma[]>([])
  const [valid, setValid] = React.useState<boolean>(true)
  const [horas] = React.useState<string[]>(
    props.data.turno === 'matutino' ? ['07','08','09','10'] :
    props.data.turno === 'vespertino' ? ['13','14','15','16'] :
    ['19','20','21','22']
  )

  const handleGet = async () => {
    try {
      const response = await api.get('/turmas', { params: { all: true, attribute: 'sala', value: props.data.uuid }})
      if (response) {
        const tempData:cadTurma[] = []
        response.data.map((item:dataTurma) => {
          tempData.push({...item,
            horario: JSON.parse(item.horario.replace(/'/g, '"'))
          })
        })
        setTurmas(tempData)
        props.setTurmas(tempData)
      }
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(()=>{
    handleGet()
  },[])
  return (
    <div className='w-full text-center'>
        <>
          <Table className='w-full'>
            <TableHeader>
              <TableRow>
                <TableHead className='text-center w-10'></TableHead>
                <TableHead className='text-center'>{horas[0]}:00</TableHead>
                <TableHead className='text-center'>{horas[1]}:00</TableHead>
                <TableHead className='text-center'>{horas[2]}:00</TableHead>
                <TableHead className='text-center'>{horas[3]}:00</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Segunda</TableCell>
                <TableCell>
                  {
                    turmas.map(item => {
                      if (item.horario.some(item => item.dia === '1' && item.hora === horas[0])) {
                        return (`${item.disciplina}`)
                      } else {
                        return('')
                      }
                    })
                  }
                </TableCell>
                <TableCell>
                  {
                    turmas.map(item => {
                      if (item.horario.some(item => item.dia === '1' && item.hora === horas[1])) {
                        return (`${item.disciplina}`)
                      } else {
                        return('')
                      }
                    })
                  }
                </TableCell>
                <TableCell>
                  {
                    turmas.map(item => {
                      if (item.horario.some(item => item.dia === '1' && item.hora === horas[2])) {
                        return (`${item.disciplina}`)
                      } else {
                        return('')
                      }
                    })
                  }
                </TableCell>
                <TableCell>
                  {
                    turmas.map(item => {
                      if (item.horario.some(item => item.dia === '1' && item.hora === horas[3])) {
                        return (`${item.disciplina}`)
                      } else {
                        return('')
                      }
                    })
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Terça</TableCell>
                <TableCell>
                  {
                    turmas.map(item => {
                      if (item.horario.some(item => item.dia === '2' && item.hora === horas[0])) {
                        return (`${item.disciplina}`)
                      } else {
                        return('')
                      }
                    })
                  }
                </TableCell>
                <TableCell>
                  {
                    turmas.map(item => {
                      if (item.horario.some(item => item.dia === '2' && item.hora === horas[1])) {
                        return (`${item.disciplina}`)
                      } else {
                        return('')
                      }
                    })
                  }
                </TableCell>
                <TableCell>
                  {
                    turmas.map(item => {
                      if (item.horario.some(item => item.dia === '2' && item.hora === horas[2])) {
                        return (`${item.disciplina}`)
                      } else {
                        return('')
                      }
                    })
                  }
                </TableCell>
                <TableCell>
                  {
                    turmas.map(item => {
                      if (item.horario.some(item => item.dia === '2' && item.hora === horas[3])) {
                        return (`${item.disciplina}`)
                      } else {
                        return('')
                      }
                    })
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Quarta</TableCell>
                <TableCell>
                  {
                    turmas.map(item => {
                      if (item.horario.some(item => item.dia === '3' && item.hora === horas[0])) {
                        return (`${item.disciplina}`)
                      } else {
                        return('')
                      }
                    })
                  }
                </TableCell>
                <TableCell>
                  {
                    turmas.map(item => {
                      if (item.horario.some(item => item.dia === '3' && item.hora === horas[1])) {
                        return (`${item.disciplina}`)
                      } else {
                        return('')
                      }
                    })
                  }
                </TableCell>
                <TableCell>
                  {
                    turmas.map(item => {
                      if (item.horario.some(item => item.dia === '3' && item.hora === horas[2])) {
                        return (`${item.disciplina}`)
                      } else {
                        return('')
                      }
                    })
                  }
                </TableCell>
                <TableCell>
                  {
                    turmas.map(item => {
                      if (item.horario.some(item => item.dia === '3' && item.hora === horas[3])) {
                        return (`${item.disciplina}`)
                      } else {
                        return('')
                      }
                    })
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Quinta</TableCell>
                <TableCell>
                  {
                    turmas.map(item => {
                      if (item.horario.some(item => item.dia === '4' && item.hora === horas[0])) {
                        return (`${item.disciplina}`)
                      } else {
                        return('')
                      }
                    })
                  }
                </TableCell>
                <TableCell>
                  {
                    turmas.map(item => {
                      if (item.horario.some(item => item.dia === '4' && item.hora === horas[1])) {
                        return (`${item.disciplina}`)
                      } else {
                        return('')
                      }
                    })
                  }
                </TableCell>
                <TableCell>
                  {
                    turmas.map(item => {
                      if (item.horario.some(item => item.dia === '4' && item.hora === horas[2])) {
                        return (`${item.disciplina}`)
                      } else {
                        return('')
                      }
                    })
                  }
                </TableCell>
                <TableCell>
                  {
                    turmas.map(item => {
                      if (item.horario.some(item => item.dia === '4' && item.hora === horas[3])) {
                        return (`${item.disciplina}`)
                      } else {
                        return('')
                      }
                    })
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Sexta</TableCell>
                <TableCell>
                  {
                    turmas.map(item => {
                      if (item.horario.some(item => item.dia === '5' && item.hora === horas[0])) {
                        return (`${item.disciplina}`)
                      } else {
                        return('')
                      }
                    })
                  }
                </TableCell>
                <TableCell>
                  {
                    turmas.map(item => {
                      if (item.horario.some(item => item.dia === '5' && item.hora === horas[1])) {
                        return (`${item.disciplina}`)
                      } else {
                        return('')
                      }
                    })
                  }
                </TableCell>
                <TableCell>
                  {
                    turmas.map(item => {
                      if (item.horario.some(item => item.dia === '5' && item.hora === horas[2])) {
                        return (`${item.disciplina}`)
                      } else {
                        return('')
                      }
                    })
                  }
                </TableCell>
                <TableCell>
                  {
                    turmas.map(item => {
                      if (item.horario.some(item => item.dia === '5' && item.hora === horas[3])) {
                        return (`${item.disciplina}`)
                      } else {
                        return('')
                      }
                    })
                  }
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </>
    </div>
  )
}

export default TableHorariosEdit