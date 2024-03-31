import React from 'react'; // Importação do React
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Importação de componentes de tabela
import api from '@/service/api'; // Importação do módulo de API
import { dataCardapio, propsView } from '@/interface'; // Importação de tipos e interfaces específicos
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Importação de ícones do React
import ModEditCard from './ModEditCard'; // Importação do componente para editar cardápios
import { EstModal } from '@/components'; // Importação do componente de modal

// Definição do componente para exibir a lista de cardápios
const ViewListCard = (props: propsView) => {

  // Estados do componente
  const [cardapios, setCardapios] = React.useState<dataCardapio[]>([]); // Estado para armazenar os cardápios
  const [cardapio, setCardapio] = React.useState<dataCardapio>(); // Estado para armazenar um cardápio selecionado
  const [actionView, setActionView] = React.useState<string>('Listar'); // Estado para controlar a ação a ser exibida (Listar ou Editar)
  const [alert, setAlert] = React.useState<boolean>(false); // Estado para exibir ou ocultar o alerta de exclusão
  const [uuid, setUuid] = React.useState<string>(''); // Estado para armazenar o UUID do cardápio a ser excluído

  // Função para buscar os cardápios na API
  const handleCardapios = async () => {
    try {
      const response = await api.get('/cardapio', { params: { all: true }});
      if (response) {
        setCardapios(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Efeito para buscar os cardápios ao montar o componente
  React.useEffect(()=> {
    handleCardapios();
  }, []);

  // Função para deletar um cardápio
  const deleteAction = async () => {
    try {
      await api.delete('/cardapio', { params: { uuid: uuid }});
      handleCardapios();
    } catch (error) {
      console.log(error);
    }
  }

  // Retorno do componente
  return (
    <>
      {/* Condicional para renderizar a lista de cardápios ou o formulário de edição */}
      {actionView === 'Listar' ? (
        <>
          <h1 className='text-lg w-full px-2'>Listar Cardápios</h1>
          <div className='flex flex-wrap p-2 w-full'>
            {/* Condicional para exibir uma mensagem enquanto os dados estão sendo carregados */}
            {cardapios.length === 0 ? (
              <p className='text-center w-full'>Aguarde alguns instantes...</p>
            ) : (
              <Table>
              {/* Tabela para exibir a lista de cardápios */}
                <TableCaption>Lista de Cardápios.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ações</TableHead>
                    <TableHead>Nome</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cardapios.map((ele) => (
                    <TableRow key={ele.uuid}>
                      <TableCell className="font-medium flex gap-2">
                        <FaEdit onClick={() => {
                          setCardapio(ele);
                          setActionView('Edit');
                        }} />
                        <FaTrashAlt onClick={() => {
                          setUuid(ele.uuid);
                          setAlert(true);
                        }} />
                      </TableCell>
                      <TableCell>{ele.nome}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell>{cardapios.length} Cardápios Cadastrados</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            )}
          </div>
          {/* Modal para confirmar a exclusão de um cardápio */}
          <EstModal 
            confirm={() => {
              deleteAction();
              setAlert(false);
            }} 
            exit={() => {
              setActionView('Listar');
              setAlert(false);
            }}
            open={alert}>
            <p className='text-center p-4'>Realmente deseja excluir este cardápio?</p>
          </EstModal>
        </>
      ) : (
        <>
        {/* Renderização do formulário para editar um cardápio */}
          {cardapio && <ModEditCard form={cardapio} setView={setActionView} reset={handleCardapios} /> }
        </>
      )}
      
    </>
  )
}

export default ViewListCard; // Exportação do componente
