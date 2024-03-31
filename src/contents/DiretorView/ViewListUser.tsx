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
import api from '@/service/api' // Importa o módulo de serviço para fazer requisições à API
import { dataUser, propsView } from '@/interface' // Importa tipos de dados de interface
import { FaEdit, FaTrashAlt } from "react-icons/fa" // Importa ícones do React
import ModEditUser from './ModEditUser' // Importa um componente de edição de usuário personalizado
import { EstModal } from '@/components' // Importa um componente de modal personalizado

const ViewListUser = (props: propsView) => { // Declaração do componente funcional

  // Define os estados usando hooks do React
  const [usuarios, setUsuarios] = React.useState<dataUser[]>([]) // Estado para armazenar a lista de usuários
  const [usuario, setUsuario] = React.useState<dataUser>() // Estado para armazenar o usuário selecionado
  const [actionView, setActionView] = React.useState<string>('Listar') // Estado para controlar a visualização (listar ou editar)
  const [alert, setAlert] = React.useState<boolean>(false) // Estado para controlar a exibição do modal de alerta
  const [uuid, setUuid] = React.useState<string>('') // Estado para armazenar o UUID do usuário a ser excluído

  // Função para lidar com a obtenção dos usuários da API
  const handleUsuarios = async () => {
    const dataUser = localStorage.getItem('@aplication/aoponto') // Obtém os dados do usuário do localStorage
    if (dataUser) {
      const tempUser = JSON.parse(dataUser) // Faz o parsing dos dados do usuário
      try {
        const response = await api.get('/usuario', { params: { all: true , attribute : "escola_uuid", value: tempUser.user.escola_uuid } }) // Faz a requisição para obter os usuários da API
        const users: dataUser[] = response.data // Extrai os usuários da resposta da API
        if (response) {
          setUsuarios(users.filter(item => item.access_level <= 4)) // Atualiza o estado dos usuários com os dados obtidos da API, filtrando apenas aqueles com nível de acesso igual ou inferior a 4
        }
      } catch (error) {
        console.log(error) // Log de erro, se houver algum problema na requisição
      }
    }
  }

  // Efeito que é executado uma vez após a montagem do componente para obter os usuários
  React.useEffect(()=> {
    handleUsuarios()
  }, [])

  // Função para lidar com a exclusão de um usuário
  const deleteAction = async () => {
    try {
      await api.delete('/usuario', { params: { uuid: uuid }}) // Faz a requisição para excluir o usuário com o UUID fornecido
      handleUsuarios() // Após a exclusão, obtém novamente a lista de usuários
    } catch (error) {
      console.log(error) // Log de erro, se houver algum problema na requisição
    }
  }

  return (
    <>
      {actionView === 'Listar' ? ( // Renderização condicional: se a ação for 'Listar', mostra a lista de usuários
        <>
          <h1 className='text-lg w-full px-2'>Listar Usuários</h1>
          <div className='flex flex-wrap p-2 w-full'>
          {usuarios.length === 0 ? ( // Se não houver usuários, exibe uma mensagem indicando para aguardar
            <p className='text-center w-full'>Aguarde alguns instantes...</p>
          ) : (
            <Table>
              <TableCaption>Lista de Usuários.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Ações</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map((ele) => ( // Mapeia e renderiza os usuários na tabela
                  <TableRow key={ele.uuid}>
                    <TableCell className="font-medium flex gap-2">
                      <FaEdit onClick={() => { // Ícone de edição: ao clicar, define o usuário selecionado para edição
                        setUsuario(ele)
                        setActionView('Edit')
                      }} />
                      <FaTrashAlt onClick={() => { // Ícone de exclusão: ao clicar, define o UUID do usuário a ser excluído e abre o modal de confirmação
                        setUuid(ele.uuid)
                        setAlert(true)
                      }} />
                    </TableCell>
                    <TableCell>{ele.nome}</TableCell> {/* Nome do usuário */}
                    <TableCell>{ele.cpf}</TableCell> {/* CPF do usuário */}
                    <TableCell>{ele.email}</TableCell> {/* Email do usuário */}
                    <TableCell>{ele.papel_name}</TableCell> {/* Nome da função do usuário */}
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell>{usuarios.length} Usuários Cadastrados</TableCell> {/* Total de usuários cadastrados */}
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
            <p className='text-center p-4'>Realmente deseja excluir este usuário?</p>
          </EstModal>
        </>
      ) : (
        <>
          {usuario && <ModEditUser form={usuario} setView={setActionView} reset={handleUsuarios} /> } {/* Se um usuário estiver selecionado, renderiza o componente ModEditUser para edição do usuário selecionado */}
        </>
      )}
      
    </>
  )
}

export default ViewListUser // Exporta o componente ViewListUser
