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
} from "@/components/ui/table" // Importa componentes de tabela personalizados
import api from '@/service/api' // Importa o serviço de API
import { dataDisciplinas, propsView } from '@/interface' // Importa tipos de dados de disciplinas e propriedades de visualização
import { FaEdit, FaTrashAlt } from "react-icons/fa" // Importa ícones do React
import { EstModal } from '@/components' // Importa o componente de modal personalizado
import ModEditDisc from './ModEditDisc' // Importa o componente de edição de disciplina

// Define o componente de visualização da lista de disciplinas
const ViewListDisc = (props: propsView) => {

  // Define estados do componente
  const [discs, setDiscs] = React.useState<dataDisciplinas[]>([]) // Armazena a lista de disciplinas
  const [disc, setDisc] = React.useState<dataDisciplinas>() // Armazena a disciplina selecionada
  const [actionView, setActionView] = React.useState<string>('Listar') // Controla a visualização atual (Listar ou Editar)
  const [alert, setAlert] = React.useState<boolean>(false) // Controla a exibição do modal de confirmação para excluir disciplinas
  const [uuid, setUuid] = React.useState<string>('') // Armazena o UUID da disciplina selecionada para exclusão

  // Função para buscar as disciplinas da API
  const handleDiscs = async () => {
    try {
      const response = await api.get('/disciplinas', { params: { all: true } }) // Requisição à API para obter todas as disciplinas
      if (response) {
        setDiscs(response.data) // Atualiza o estado com as disciplinas recebidas da API
      }
    } catch (error) {
      console.log(error) // Log de erro caso ocorra uma falha na requisição
    }
  }

  // Hook useEffect para buscar as disciplinas quando o componente é montado
  React.useEffect(()=> {
    handleDiscs()
  }, [])

  // Função para excluir uma disciplina
  const deleteAction = async () => {
    try {
      await api.delete('/disciplinas', { params: { uuid: uuid }}) // Requisição à API para excluir a disciplina com o UUID fornecido
      handleDiscs() // Atualiza a lista de disciplinas após a exclusão
    } catch (error) {
      console.log(error) // Log de erro caso ocorra uma falha na requisição de exclusão
    }
  }

  // Renderização do componente
  return (
    <>
      {actionView === 'Listar' ? ( // Se a visualização atual for "Listar"
        <>
          <h1 className='text-lg w-full px-2'>Listar Disciplinas</h1> {/* Título da página */}
          <div className='flex flex-wrap p-2 w-full'> {/* Div principal com layout flexível */}
          {discs.length === 0 ? ( // Se não houver disciplinas na lista
            <p className='text-center w-full'>Aguarde alguns instantes...</p> // Exibe mensagem de carregamento
          ) : (
            <Table> {/* Renderiza uma tabela */}
              <TableCaption>Lista de Disciplinas.</TableCaption> {/* Legenda da tabela */}
              <TableHeader> {/* Cabeçalho da tabela */}
                <TableRow> {/* Linha do cabeçalho */}
                  <TableHead>Ações</TableHead> {/* Célula de cabeçalho para as ações */}
                  <TableHead>Nome</TableHead> {/* Célula de cabeçalho para o nome da disciplina */}
                </TableRow>
              </TableHeader>
              <TableBody> {/* Corpo da tabela */}
                {discs.map((ele) => ( // Mapeia e renderiza cada disciplina na lista
                  <TableRow key={ele.uuid}> {/* Linha da tabela com chave única */}
                    <TableCell className="font-medium flex gap-2"> {/* Célula de ações com estilo flexível */}
                      <FaEdit onClick={() => { // Ícone de edição para editar a disciplina
                        setDisc(ele) // Define a disciplina selecionada para edição
                        setActionView('Edit') // Altera a visualização para edição
                      }} />
                      <FaTrashAlt onClick={() => { // Ícone de exclusão para excluir a disciplina
                        setUuid(ele.uuid) // Define o UUID da disciplina selecionada para exclusão
                        setAlert(true) // Exibe o modal de confirmação de exclusão
                      }} />
                    </TableCell>
                    <TableCell>{ele.name}</TableCell> {/* Célula com o nome da disciplina */}
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter> {/* Rodapé da tabela */}
                <TableRow> {/* Linha do rodapé */}
                  <TableCell colSpan={3}>Total</TableCell> {/* Célula com colspan para ocupar todas as colunas */}
                  <TableCell>{discs.length} Disciplinas Cadastradas</TableCell> {/* Célula com o total de disciplinas cadastradas */}
                </TableRow>
              </TableFooter>
            </Table>
          )}
          </div>
          {/* Modal de confirmação para excluir disciplinas */}
          <EstModal 
            confirm={() => { // Função de confirmação ao excluir
              deleteAction() // Exclui a disciplina selecionada
              setAlert(false) // Fecha o modal de confirmação
            }} 
            exit={() => { // Função de saída sem exclusão
              setActionView('Listar') // Mantém a visualização de listagem
              setAlert(false) // Fecha o modal de confirmação
            }}
            open={alert}> {/* Propriedade para controlar a exibição do modal */}
            <p className='text-center p-4'>Realmente deseja excluir esta disciplina?</p> {/* Mensagem de confirmação no modal */}
          </EstModal>
        </>
      ) : (
        <>
          {disc && <ModEditDisc form={disc} setView={setActionView} reset={handleDiscs} /> } {/* Renderiza o componente de edição de disciplina se uma disciplina estiver selecionada */}
        </>
      )}
    </>
  )
}

export default ViewListDisc // Exporta o componente de visualização da lista de disciplinas
