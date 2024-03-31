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
import { dataUser, propsView } from '@/interface' // Importa tipos de dados de usuários e propriedades de visualização
import { FaEdit, FaTrashAlt } from "react-icons/fa" // Importa ícones do React
import ModEditUser from './ModEditUser' // Importa o componente de edição de usuário
import { EstModal } from '@/components' // Importa o componente de modal personalizado

// Define o componente de visualização da lista de usuários
const ViewListUser = (props: propsView) => {

  // Define estados do componente
  const [usuarios, setUsuarios] = React.useState<dataUser[]>([]) // Armazena a lista de usuários
  const [usuario, setUsuario] = React.useState<dataUser>() // Armazena o usuário selecionado
  const [actionView, setActionView] = React.useState<string>('Listar') // Controla a visualização atual (Listar ou Editar)
  const [alert, setAlert] = React.useState<boolean>(false) // Controla a exibição do modal de confirmação para excluir usuários
  const [uuid, setUuid] = React.useState<string>('') // Armazena o UUID do usuário selecionado para exclusão

  // Função para buscar os usuários da API
  const handleUsuarios = async () => {
    try {
      const response = await api.get('/usuario', { params: { all: true }}) // Requisição à API para obter todos os usuários
      const users: dataUser[] = response.data
      if (response) {
        setUsuarios(users.filter(item => item.access_level <= 5)) // Atualiza o estado com os usuários recebidos da API, filtrando apenas os de nível de acesso menor ou igual a 5
      }
    } catch (error) {
      console.log(error) // Log de erro caso ocorra uma falha na requisição
    }
  }

  // Hook useEffect para buscar os usuários quando o componente é montado
  React.useEffect(()=> {
    handleUsuarios()
  }, [])

  // Função para excluir um usuário
  const deleteAction = async () => {
    try {
      await api.delete('/usuario', { params: { uuid: uuid }}) // Requisição à API para excluir o usuário com o UUID fornecido
      handleUsuarios() // Atualiza a lista de usuários após a exclusão
    } catch (error) {
      console.log(error) // Log de erro caso ocorra uma falha na requisição de exclusão
    }
  }

  // Renderização do componente
  return (
    <>
      {actionView === 'Listar' ? ( // Se a visualização atual for "Listar"
        <>
          <h1 className='text-lg w-full px-2'>Listar Usuários</h1> {/* Título da página */}
          <div className='flex flex-wrap p-2 w-full'> {/* Div principal com layout flexível */}
          {usuarios.length === 0 ? ( // Se não houver usuários na lista
            <p className='text-center w-full'>Aguarde alguns instantes...</p> // Exibe mensagem de carregamento
          ) : (
            <Table> {/* Renderiza uma tabela */}
              <TableCaption>Lista de Usuários.</TableCaption> {/* Legenda da tabela */}
              <TableHeader> {/* Cabeçalho da tabela */}
                <TableRow> {/* Linha do cabeçalho */}
                  <TableHead>Ações</TableHead> {/* Célula de cabeçalho para as ações */}
                  <TableHead>Nome</TableHead> {/* Célula de cabeçalho para o nome do usuário */}
                  <TableHead>CPF</TableHead> {/* Célula de cabeçalho para o CPF do usuário */}
                  <TableHead>Email</TableHead> {/* Célula de cabeçalho para o email do usuário */}
                  <TableHead>Função</TableHead> {/* Célula de cabeçalho para a função do usuário */}
                </TableRow>
              </TableHeader>
              <TableBody> {/* Corpo da tabela */}
                {usuarios.map((ele) => ( // Mapeia e renderiza cada usuário na lista
                  <TableRow key={ele.uuid}> {/* Linha da tabela com chave única */}
                    <TableCell className="font-medium flex gap-2"> {/* Célula de ações com estilo flexível */}
                      <FaEdit onClick={() => { // Ícone de edição para editar o usuário
                        setUsuario(ele) // Define o usuário selecionado para edição
                        setActionView('Edit') // Altera a visualização para edição
                      }} />
                      <FaTrashAlt onClick={() => { // Ícone de exclusão para excluir o usuário
                        setUuid(ele.uuid) // Define o UUID do usuário selecionado para exclusão
                        setAlert(true) // Exibe o modal de confirmação de exclusão
                      }} />
                    </TableCell>
                    <TableCell>{ele.nome}</TableCell> {/* Célula com o nome do usuário */}
                    <TableCell>{ele.cpf}</TableCell> {/* Célula com o CPF do usuário */}
                    <TableCell>{ele.email}</TableCell> {/* Célula com o email do usuário */}
                    <TableCell>{ele.papel_name}</TableCell> {/* Célula com a função do usuário */}
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter> {/* Rodapé da tabela */}
                <TableRow> {/* Linha do rodapé */}
                  <TableCell colSpan={3}>Total</TableCell> {/* Célula com colspan para ocupar todas as colunas */}
                  <TableCell>{usuarios.length} Usuários Cadastrados</TableCell> {/* Célula com o total de usuários cadastrados */}
                </TableRow>
              </TableFooter>
            </Table>
          )}
          </div>
          {/* Modal de confirmação para excluir usuários */}
          <EstModal 
            confirm={() => { // Função de confirmação de exclusão
              deleteAction() // Chama a função para excluir o usuário
              setAlert(false) // Fecha o modal de confirmação
            }} 
            exit={() => { // Função de cancelamento da exclusão
              setActionView('Listar') // Retorna à visualização da lista de usuários
              setAlert(false) // Fecha o modal de confirmação
            }}
            open={alert}> {/* Define se o modal está aberto ou fechado */}
            <p className='text-center p-4'>Realmente deseja excluir este usuário?</p> {/* Mensagem de confirmação de exclusão */}
          </EstModal>
        </>
      ) : (
        <>
          {usuario && <ModEditUser form={usuario} setView={setActionView} reset={handleUsuarios} /> } {/* Renderiza o componente de edição de usuário se um usuário estiver selecionado */}
        </>
      )}
    </>
  )
}

export default ViewListUser // Exporta o componente de visualização da lista de usuários
