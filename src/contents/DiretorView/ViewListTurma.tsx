import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table" // Importação de componentes de tabela personalizados
import api from '@/service/api' // Importação do módulo de serviço para fazer requisições à API
import { dataSala, dataTurma, dataUser, horario, propSelect, propsView } from '@/interface' // Importação de tipos de dados de interface
import { FaEdit, FaTrashAlt } from "react-icons/fa" // Importação de ícones do React
import { EleInput, EstModal } from '@/components' // Importação de componentes personalizados
import ModEditTurma from './ModEditTurma' // Importação de um componente de edição de turma personalizado

const ViewListTurma = (props: propsView) => { // Declaração do componente funcional

  // Definição dos estados usando hooks do React
  const [turmas, setTurmas] = React.useState<dataTurma[]>([]) // Estado para armazenar a lista de turmas
  const [turma, setTurma] = React.useState<dataTurma>({ // Estado para armazenar a turma selecionada
    created_at: '',
    disciplina: '',
    horario: '',
    nome_professor: '',
    sala: '',
    updated_at: '',
    uuid:  ''
  })
  const [salas, setSalas] = React.useState<propSelect[]>([]) // Estado para armazenar a lista de salas
  const [sala, setSala] = React.useState<string>('') // Estado para armazenar a sala selecionada
  const [actionView, setActionView] = React.useState<string>('Listar') // Estado para controlar a visualização (listar ou editar)
  const [alert, setAlert] = React.useState<boolean>(false) // Estado para controlar a exibição do modal de alerta
  const [uuid, setUuid] = React.useState<string>('') // Estado para armazenar o UUID da turma a ser excluída
  const [horariosTurma, setHorariosTurma] = React.useState<horario[]>([]) // Estado para armazenar os horários da turma selecionada

  // Função para lidar com a obtenção das salas da API
  const handleSalas = async () => {
    const dataUser = localStorage.getItem('@aplication/aoponto') // Obtém os dados do usuário do localStorage
    if (dataUser) {
      const tempUser = JSON.parse(dataUser) // Faz o parsing dos dados do usuário
      try {
        const response = await api.get('/salas', { params: { all: true , attribute : "escola_uuid", value: tempUser.user.escola_uuid } }) // Faz a requisição para obter as salas da API
        if (response) {
          const tempResp = response.data.map((item: { nome: any; uuid: any }) => { // Mapeia os dados das salas para o formato necessário
            return {
              name: item.nome,
              uuid: item.uuid
            }
          })
          setSalas(tempResp) // Atualiza o estado das salas com os dados obtidos da API
        }
      } catch (error) {
        console.log(error) // Log de erro, se houver algum problema na requisição
      }
    }
  }

  // Efeito que é executado uma vez após a montagem do componente para obter as salas
  React.useEffect(()=> {
    handleSalas()
  }, [])

  // Função para lidar com a seleção de uma sala
  const handleSelect = async (value: string, label: string) => {
    setSala(value) // Atualiza o estado da sala selecionada
    try {
      const response = await api.get('/turmas', { params: { all: true, attribute: 'sala', value: value }}) // Faz a requisição para obter as turmas da sala selecionada
      setTurmas(response.data) // Atualiza o estado das turmas com os dados obtidos da API
    } catch (error) {
      console.log(error) // Log de erro, se houver algum problema na requisição
    }
  }

  // Função para redefinir as turmas ao selecionar uma nova sala
  const handleReset = async () => {
    try {
      const response = await api.get('/turmas', { params: { all: true, attribute: 'sala', value: sala }}) // Faz a requisição para obter as turmas da sala selecionada
      setTurmas(response.data) // Atualiza o estado das turmas com os dados obtidos da API
    } catch (error) {
      console.log(error) // Log de erro, se houver algum problema na requisição
    }
  }

  // Função para lidar com a exclusão de uma turma
  const deleteAction = async () => {
    try {
      await api.delete('/turmas', { params: { uuid: uuid }}) // Faz a requisição para excluir a turma com o UUID fornecido
      handleReset() // Após a exclusão, redefina as turmas
    } catch (error) {
      console.log(error) // Log de erro, se houver algum problema na requisição
    }
  }

  return (
    <>
      {actionView === 'Listar' ? ( // Renderização condicional: se a ação for 'Listar', mostra a lista de turmas
        <>
          <h1 className='text-lg w-full px-2'>Listar Turmas</h1>
          <EleInput label='Série' name='serie' type='select' data={salas} value={sala} onChange={handleSelect} /> {/* Componente de entrada para selecionar a sala */}
          <div className='flex flex-wrap p-2 w-full'>
          {turmas.length === 0 ? ( // Se não houver turmas, exibe uma mensagem indicando para selecionar uma sala
            <p className='text-center w-full'>Selecione uma Turma</p>
          ) : (
            <Table>
              <TableCaption>Lista de Turmas.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Ações</TableHead>
                  <TableHead>Série</TableHead>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Professor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {turmas.map((ele) => ( // Mapeia e renderiza as turmas na tabela
                  <TableRow key={ele.uuid}>
                    <TableCell className="font-medium flex gap-2">
                      <FaEdit onClick={() => { // Ícone de edição: ao clicar, define a turma selecionada para edição
                        setTurma(ele)
                        setActionView('Edit')
                        setHorariosTurma(JSON.parse(ele.horario.replace(/'/g, '"'))) // Converte a string de horário para um array de objetos
                      }} />
                      <FaTrashAlt onClick={() => { // Ícone de exclusão: ao clicar, define o UUID da turma a ser excluída e abre o modal de confirmação
                        setUuid(ele.uuid)
                        setAlert(true)
                      }} />
                    </TableCell>
                    <TableCell>{salas.find(item => item.uuid === ele.sala)?.name}</TableCell> {/* Nome da sala */}
                    <TableCell>{ele.disciplina}</TableCell> {/* Disciplina da turma */}
                    <TableCell>{ele.nome_professor}</TableCell> {/* Nome do professor */}
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell>{turmas.length} turmas Cadastradas</TableCell> {/* Total de turmas cadastradas */}
                </TableRow>
              </TableFooter>
            </Table>
          )}
          </div>
          {/* Componente modal personalizado para confirmação de exclusão */}
          <EstModal 
            confirm={() => {
              deleteAction()
              setAlert(false)
            }} 
            exit={() => {
              setActionView('Listar')
              setAlert(false)
            }}
            open={alert}>
            <p className='text-center p-4'>Realmente deseja excluir esta sala?</p>
          </EstModal>
        </>
      ) : (
        <>
          {sala &&  // Se uma sala estiver selecionada, renderiza o componente ModEditTurma para edição da turma selecionada
            <ModEditTurma 
              form={turma} 
              setView={setActionView} 
              reset={handleReset} 
            /> 
          }
        </>
      )}
      
    </>
  )
}

export default ViewListTurma // Exporta o componente ViewListTurma
