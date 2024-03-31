// Importação dos componentes de tabela e das interfaces necessárias, além da API para comunicação com o backend.
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cadTurma, dataSala, dataTurma, horario } from '@/interface'
import api from '@/service/api'
import React from 'react'

// Interface para as propriedades que o componente TableHorarios espera receber.
interface propsTableHorarios {
    data: dataSala, // Informações da sala selecionada.
    setOk: React.Dispatch<React.SetStateAction<boolean>>, // Função para atualizar o estado indicando a validade da configuração atual.
    disciplina: string, // A disciplina em questão para a verificação de disponibilidade.
    setTurmas: React.Dispatch<React.SetStateAction<cadTurma[]>> // Função para atualizar o estado das turmas.
}

const TableHorarios = (props:propsTableHorarios) => {
  // Estados do componente.
  const [turmas, setTurmas] = React.useState<cadTurma[]>([]) // Armazena as turmas associadas à sala.
  const [valid, setValid] = React.useState<boolean>(true) // Indica se a disciplina está válida para ser alocada na sala.
  // Deriva os horários com base no turno da sala.
  const [horas] = React.useState<string[]>(
    props.data.turno === 'matutino' ? ['07','08','09','10'] :
    props.data.turno === 'vespertino' ? ['13','14','15','16'] :
    ['19','20','21','22']
  )

  // Função para carregar as turmas da sala e verificar a disponibilidade para a disciplina.
  const handleGet = async () => {
    try {
      const response = await api.get('/turmas', { params: { all: true, attribute: 'sala', value: props.data.uuid }})
      if (response) {
        // Transforma e armazena os dados das turmas.
        const tempData:cadTurma[] = response.data.map((item:dataTurma) => ({
          ...item, horario: JSON.parse(item.horario.replace(/'/g, '"'))
        }))
        setTurmas(tempData)
        props.setTurmas(tempData)
        // Verifica se a disciplina já está alocada na sala.
        const temp = response.data.find((item: { disciplina: string }) => item.disciplina === props.disciplina)
        if (temp) {
          props.setOk(false)
          setValid(false)
        } else {
          props.setOk(true)
          setValid(true)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Efeito para executar a função handleGet quando o componente é montado.
  React.useEffect(()=>{
    handleGet()
  },[])

  // Renderização do componente: mostra a tabela de horários se a disciplina for válida, caso contrário, exibe uma mensagem.

  return (
    <div className='w-full text-center'>
      {valid ? (
        <>
          <Table className='w-full'>
            <TableHeader>
              <TableRow>
                {/* Cabeçalho da tabela com os horários de acordo com o turno */}
                <TableHead className='text-center w-10'></TableHead>
                <TableHead className='text-center'>{horas[0]}:00</TableHead>
                <TableHead className='text-center'>{horas[1]}:00</TableHead>
                <TableHead className='text-center'>{horas[2]}:00</TableHead>
                <TableHead className='text-center'>{horas[3]}:00</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Linhas para cada dia da semana, verificando a existência de disciplinas nos horários */}
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
      ): (
        <>
          Disciplina já cadastrada
        </> // Mensagem exibida se a disciplina já estiver alocada na sala.
      )}
    </div>
  )
}

export default TableHorarios // Exporta o componente para uso em outras partes da aplicação.
