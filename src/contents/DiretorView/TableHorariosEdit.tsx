// Importações dos componentes de UI para construir tabelas, junto com interfaces de tipos e a API de serviço.
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cadTurma, dataSala, dataTurma, horario } from '@/interface'
import api from '@/service/api'
import React from 'react'

// Definição da interface para as propriedades que o componente espera receber.
interface propsTableHorarios {
    data: dataSala, // Dados sobre a sala, incluindo o turno e identificador único.
    disciplina: string, // Nome da disciplina para verificação de alocação.
    setTurmas: React.Dispatch<React.SetStateAction<cadTurma[]>> // Função para atualizar o estado de turmas em um componente pai.
}

const TableHorariosEdit = (props:propsTableHorarios) => {
  // Estado para manter a lista de turmas associadas à sala.
  const [turmas, setTurmas] = React.useState<cadTurma[]>([])
  // Estado para os horários específicos, determinados pelo turno da sala.
  const [horas] = React.useState<string[]>(
    props.data.turno === 'matutino' ? ['07','08','09','10'] :
    props.data.turno === 'vespertino' ? ['13','14','15','16'] :
    ['19','20','21','22']
  )

  // Função assíncrona para buscar e processar as turmas da sala especificada.
  const handleGet = async () => {
    try {
      const response = await api.get('/turmas', { params: { all: true, attribute: 'sala', value: props.data.uuid }})
      if (response) {
        // Transforma os dados recebidos, preparando-os para exibição.
        const tempData:cadTurma[] = response.data.map((item:dataTurma) => ({
          ...item,
          horario: JSON.parse(item.horario.replace(/'/g, '"')) // Converte a string de horário em JSON.
        }))
        setTurmas(tempData)
        props.setTurmas(tempData) // Atualiza o estado de turmas no componente pai.
      }
    } catch (error) {
      console.log(error) // Loga erros de requisição à API.
    }
  }

  // Efeito para carregar as turmas quando o componente é montado.
  React.useEffect(()=>{
    handleGet()
  },[])

  // Renderiza a tabela de horários para edição.
  return (
    <div className='w-full text-center'>
        <>
          <Table className='w-full'>
            <TableHeader>
              <TableRow>
                {/* Cabeçalho vazio para o nome do dia e cabeçalhos para cada horário baseado no turno */}
                <TableHead className='text-center w-10'></TableHead>
                <TableHead className='text-center'>{horas[0]}:00</TableHead>
                <TableHead className='text-center'>{horas[1]}:00</TableHead>
                <TableHead className='text-center'>{horas[2]}:00</TableHead>
                <TableHead className='text-center'>{horas[3]}:00</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Gera linhas para cada dia da semana, verificando e mostrando a disciplina para cada horário, se houver */}
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