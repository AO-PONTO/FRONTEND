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
import { dataSala, propsView } from '@/interface' // Importação de tipos de dados de interface
import { FaEdit, FaTrashAlt } from "react-icons/fa" // Importação de ícones do React
import { EstModal } from '@/components' // Importação de um componente modal personalizado
import ModEditSala from './ModEditSala' // Importação de um componente de edição de sala personalizado

const ViewListSala = (props: propsView) => { // Declaração do componente funcional

  // Definição dos estados usando hooks do React
  const [salas, setSalas] = React.useState<dataSala[]>([]) // Estado para armazenar a lista de salas
  const [sala, setSala] = React.useState<dataSala>() // Estado para armazenar a sala selecionada
  const [actionView, setActionView] = React.useState<string>('Listar') // Estado para controlar a visualização (listar ou editar)
  const [alert, setAlert] = React.useState<boolean>(false) // Estado para controlar a exibição do modal de alerta
  const [uuid, setUuid] = React.useState<string>('') // Estado para armazenar o UUID da sala a ser excluída

  // Função para lidar com a obtenção das salas da API
  const handleSalas = async () => {
    const dataUser = localStorage.getItem('@aplication/aoponto') // Obtém os dados do usuário do localStorage
    if (dataUser) {
      const tempUser = JSON.parse(dataUser) // Faz o parsing dos dados do usuário
      try {
        const response = await api.get('/salas', { params: { all: true , attribute : "escola_uuid", value: tempUser.user.escola_uuid } }) // Faz a requisição para obter as salas da API
        if (response) {
          setSalas(response.data) // Atualiza o estado das salas com os dados obtidos da API
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

  // Função para lidar com a exclusão de uma sala
  const deleteAction = async () => {
    try {
      await api.delete('/salas', { params: { uuid: uuid }}) // Faz a requisição para excluir a sala com o UUID fornecido
      handleSalas() // Após a exclusão, atualiza a lista de salas
    } catch (error) {
      console.log(error) // Log de erro, se houver algum problema na requisição
    }
  }

  return (
    <>
      {actionView === 'Listar' ? ( // Renderização condicional: se a ação for 'Listar', mostra a lista de salas
        <>
          <h1 className='text-lg w-full px-2'>Listar Séries</h1>
          <div className='flex flex-wrap p-2 w-full'>
          {salas.length === 0 ? ( // Se não houver salas, exibe uma mensagem de espera
            <p className='text-center w-full'>Aguarde alguns instantes...</p>
          ) : (
            <Table> {/* Componente de tabela personalizado */}
              <TableCaption>Lista de Séries.</TableCaption>
              <TableHeader> {/* Cabeçalho da tabela */}
                <TableRow>
                  <TableHead>Ações</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead>Turno</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody> {/* Corpo da tabela */}
                {salas.map((ele) => ( // Mapeia cada sala e exibe suas informações em uma linha da tabela
                  <TableRow key={ele.uuid}>
                    <TableCell className="font-medium flex gap-2">
                      <FaEdit onClick={() => {
                        setSala(ele)
                        setActionView('Edit')
                      }} /> {/* Ícone de edição: ao clicar, define a sala selecionada para edição */}
                      <FaTrashAlt onClick={() => {
                        setUuid(ele.uuid)
                        setAlert(true)
                      }} /> {/* Ícone de exclusão: ao clicar, define o UUID da sala a ser excluída e abre o modal de confirmação */}
                    </TableCell>
                    <TableCell>{ele.nome}</TableCell> {/* Nome da sala */}
                    <TableCell>{ele.ano}</TableCell> {/* Ano da sala */}
                    <TableCell>{ele.turno}</TableCell> {/* Turno da sala */}
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter> {/* Rodapé da tabela */}
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell>{salas.length} Séries Cadastradas</TableCell> {/* Total de séries cadastradas */}
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
            <p className='text-center p-4'>Realmente deseja excluir esta série?</p>
          </EstModal>
        </>
      ) : (
        <>
          {sala && <ModEditSala form={sala} setView={setActionView} reset={handleSalas} /> } {/* Renderiza o componente ModEditSala para edição da sala selecionada */}
        </>
      )}
      
    </>
  )
}

export default ViewListSala // Exporta o componente ViewListSala
