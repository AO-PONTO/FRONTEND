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
import { dataEsc, propsView } from '@/interface' // Importa tipos de dados de escolas e propriedades de visualização
import { FaEdit, FaTrashAlt } from "react-icons/fa" // Importa ícones do React
import ModEditEsc from './ModEditEsc' // Importa o componente de edição de escola
import { EstModal } from '@/components' // Importa o componente de modal personalizado

// Define o componente de visualização da lista de escolas
const ViewListEsc = (props: propsView) => {

  // Define estados do componente
  const [escolas, setEscolas] = React.useState<dataEsc[]>([]) // Armazena a lista de escolas
  const [escola, setEscola] = React.useState<dataEsc>() // Armazena a escola selecionada
  const [actionView, setActionView] = React.useState<string>('Listar') // Controla a visualização atual (Listar ou Editar)
  const [alert, setAlert] = React.useState<boolean>(false) // Controla a exibição do modal de confirmação para excluir escolas
  const [uuid, setUuid] = React.useState<string>('') // Armazena o UUID da escola selecionada para exclusão

  // Função para buscar as escolas da API
  const handleEscolas = async () => {
    try {
      const response = await api.get('/escolas', { params: { all: true }}) // Requisição à API para obter todas as escolas
      if (response) {
        setEscolas(response.data) // Atualiza o estado com as escolas recebidas da API
      }
    } catch (error) {
      console.log(error) // Log de erro caso ocorra uma falha na requisição
    }
  }

  // Hook useEffect para buscar as escolas quando o componente é montado
  React.useEffect(()=> {
    handleEscolas()
  }, [])

  // Função para excluir uma escola
  const deleteAction = async () => {
    try {
      await api.delete('/escolas', { params: { uuid: uuid }}) // Requisição à API para excluir a escola com o UUID fornecido
      handleEscolas() // Atualiza a lista de escolas após a exclusão
    } catch (error) {
      console.log(error) // Log de erro caso ocorra uma falha na requisição de exclusão
    }
  }

  // Renderização do componente
  return (
    <>
      {actionView === 'Listar' ? ( // Se a visualização atual for "Listar"
        <>
          <h1 className='text-lg w-full px-2'>Listar Escolas</h1> {/* Título da página */}
          <div className='flex flex-wrap p-2 w-full'> {/* Div principal com layout flexível */}
          {escolas.length === 0 ? ( // Se não houver escolas na lista
            <p className='text-center w-full'>Aguarde alguns instantes...</p> // Exibe mensagem de carregamento
          ) : (
            <Table> {/* Renderiza uma tabela */}
              <TableCaption>Lista de Escolas.</TableCaption> {/* Legenda da tabela */}
              <TableHeader> {/* Cabeçalho da tabela */}
                <TableRow> {/* Linha do cabeçalho */}
                  <TableHead>Ações</TableHead> {/* Célula de cabeçalho para as ações */}
                  <TableHead>Nome</TableHead> {/* Célula de cabeçalho para o nome da escola */}
                  <TableHead>Cod. INEP</TableHead> {/* Célula de cabeçalho para o código INEP da escola */}
                  <TableHead>Etapa de Ensino</TableHead> {/* Célula de cabeçalho para a etapa de ensino da escola */}
                </TableRow>
              </TableHeader>
              <TableBody> {/* Corpo da tabela */}
                {escolas.map((ele) => ( // Mapeia e renderiza cada escola na lista
                  <TableRow key={ele.uuid}> {/* Linha da tabela com chave única */}
                    <TableCell className="font-medium flex gap-2"> {/* Célula de ações com estilo flexível */}
                      <FaEdit onClick={() => { // Ícone de edição para editar a escola
                        setEscola(ele) // Define a escola selecionada para edição
                        setActionView('Edit') // Altera a visualização para edição
                      }} />
                      <FaTrashAlt onClick={() => { // Ícone de exclusão para excluir a escola
                        setUuid(ele.uuid) // Define o UUID da escola selecionada para exclusão
                        setAlert(true) // Exibe o modal de confirmação de exclusão
                      }} />
                    </TableCell>
                    <TableCell>{ele.nome}</TableCell> {/* Célula com o nome da escola */}
                    <TableCell>{ele.inep_codigo}</TableCell> {/* Célula com o código INEP da escola */}
                    <TableCell>{ele.etapa_ensino}</TableCell> {/* Célula com a etapa de ensino da escola */}
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter> {/* Rodapé da tabela */}
                <TableRow> {/* Linha do rodapé */}
                  <TableCell colSpan={3}>Total</TableCell> {/* Célula com colspan para ocupar todas as colunas */}
                  <TableCell>{escolas.length} Escolas Cadastradas</TableCell> {/* Célula com o total de escolas cadastradas */}
                </TableRow>
              </TableFooter>
            </Table>
          )}
          </div>
          {/* Modal de confirmação para excluir escolas */}
          <EstModal 
            confirm={() => { // Função de confirmação ao excluir
              deleteAction() // Exclui a escola selecionada
              setAlert(false) // Fecha o modal de confirmação
            }} 
            exit={() => { // Função de saída sem exclusão
              setActionView('Listar') // Mantém a visualização de listagem
              setAlert(false) // Fecha o modal de confirmação
            }}
            open={alert}> {/* Propriedade para controlar a exibição do modal */}
            <p className='text-center p-4'>Realmente deseja excluir esta escola?</p> {/* Mensagem de confirmação no modal */}
          </EstModal>
        </>
      ) : (
        <>
          {escola && <ModEditEsc form={escola} setView={setActionView} reset={handleEscolas}/> } {/* Renderiza o componente de edição de escola se uma escola estiver selecionada */}
        </>
      )}
    </>
  )
}

export default ViewListEsc // Exporta o componente de visualização da lista de escolas
