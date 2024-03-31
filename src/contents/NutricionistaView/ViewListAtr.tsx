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
import { dataCardEsc, propsView } from '@/interface'; // Importação de tipos e interfaces específicos
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Importação de ícones do React
import ModEditAtr from './ModEditAtr'; // Importação do componente para editar atribuições
import { EstModal } from '@/components'; // Importação do componente de modal

// Definição do componente para exibir a lista de atribuições de cardápio
const ViewListAtr = (props: propsView) => {
  
  // Estados do componente
  const [cardEscs, setCardEscs] = React.useState<dataCardEsc[]>([]); // Estado para armazenar as atribuições de cardápio
  const [cardEsc, setCardEsc] = React.useState<dataCardEsc>(); // Estado para armazenar uma atribuição de cardápio selecionada
  const [actionView, setActionView] = React.useState<string>('Listar'); // Estado para controlar a ação a ser exibida (Listar ou Editar)
  const [alert, setAlert] = React.useState<boolean>(false); // Estado para exibir ou ocultar o alerta de exclusão
  const [uuid, setUuid] = React.useState<string>(''); // Estado para armazenar o UUID da atribuição a ser excluída

  // Função para buscar as atribuições de cardápio na API
  const handleCadEscs = async () => {
    try {
      const response = await api.get('/cardapio-escola', { params: { all: true }});
      if (response) {
        setCardEscs(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Efeito para buscar as atribuições de cardápio ao montar o componente
  React.useEffect(()=> {
    handleCadEscs();
  }, []);

  // Função para deletar uma atribuição de cardápio
  const deleteAction = async () => {
    try {
      await api.delete('/cardapio-escola', { params: { uuid: uuid }});
      handleCadEscs();
    } catch (error) {
      console.log(error);
    }
  }

  // Retorno do componente
  return (
    <>
      {/* Condicional para renderizar a lista de atribuições ou o formulário de edição */}
      {actionView === 'Listar' ? (
        <>
          <h1 className='text-lg w-full px-2'>Listar Cardápios Atribuídos</h1>
          <div className='flex flex-wrap p-2 w-full'>
            {/* Condicional para exibir uma mensagem enquanto os dados estão sendo carregados */}
            {cardEscs.length === 0 ? (
              <p className='text-center w-full'>Aguarde alguns instantes...</p>
            ) : (
              /* Tabela para exibir a lista de atribuições de cardápio */
              <Table>
                <TableCaption>Lista de Cardápios Atribuídos.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ações</TableHead>
                    <TableHead>Cardápio</TableHead>
                    <TableHead>Dia da Semana</TableHead>
                    <TableHead>Turno</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cardEscs.map((ele) => (
                    <TableRow key={ele.uuid}>
                      <TableCell className="font-medium flex gap-2">
                        <FaEdit onClick={() => {
                          setCardEsc(ele);
                          setActionView('Edit');
                        }} />
                        <FaTrashAlt onClick={() => {
                          setUuid(ele.uuid);
                          setAlert(true);
                        }} />
                      </TableCell>
                      <TableCell>{ele.cardapio_name}</TableCell>
                      <TableCell>{ele.dia_da_semana}</TableCell>
                      <TableCell>{ele.turno}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell>{cardEscs.length} Cardápios Atriuídos</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            )}
          </div>
          {/* Modal para confirmar a exclusão de uma atribuição de cardápio */}
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
            <p className='text-center p-4'>Realmente deseja excluir esta atribuição?</p>
          </EstModal>
        </>
      ) : (
        /* Renderização do formulário para editar uma atribuição de cardápio */
        <>
          {cardEsc && <ModEditAtr form={cardEsc} setView={setActionView} reset={handleCadEscs} /> }
        </>
      )}
      
    </>
  )
}

export default ViewListAtr; // Exportação do componente
