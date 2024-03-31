import { EleButton, EleInput, EleAlert } from '@/components'; // Importa componentes EleButton, EleInput e EleAlert do diretório '@/components'
import { dataSala, propSelect } from '@/interface'; // Importa a interface dataSala e propSelect do diretório '@/interface'
import api from '@/service/api'; // Importa o módulo api do diretório '@/service/api'
import React from 'react'; // Importa React do pacote react

interface Module {
  form: dataSala; // Interface para o formulário da sala
  setView: React.Dispatch<React.SetStateAction<string>>; // Função para atualizar a visualização
  reset?: Function; // Função opcional para redefinir o estado
}

const ModEditSala = (props: Module) => {
  const turno: propSelect[] = [
    { name: 'matutino', uuid: 'matutino' },
    { name: 'vespertino', uuid: 'vespertino' },
    { name: 'noturno', uuid: 'noturno' },
  ];

  const date = new Date();
  const ano = date.getFullYear().toString();
  const anoQueVem = String(date.getFullYear() + 1);
  const anos: propSelect[] = [
    { name: ano, uuid: ano },
    { name: anoQueVem, uuid: anoQueVem },
  ];

  const [form, setForm] = React.useState<dataSala>(props.form); // Estado para o formulário da sala
  const [alert, setAlert] = React.useState<boolean>(false); // Estado para controlar a exibição do alerta
  const [exit, setExit] = React.useState<boolean>(false); // Estado para controlar a saída
  const [message, setMessage] = React.useState<string>(''); // Estado para a mensagem do alerta

  // Função para lidar com a alteração do formulário
  const handleChangeForm = (value: string, label: string) => {
    setForm((prev) => ({ ...prev, [label]: value }));
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async () => {
    let updatedForm = { ...form, updated_at: date }; // Formulário atualizado com a data de atualização

    // Verifica se todos os campos obrigatórios foram preenchidos
    if (updatedForm.nome === '' || updatedForm.turno === '' || updatedForm.ano === '') {
      setMessage('Preencha todos os campos corretamente');
      setAlert(true);
    } else {
      try {
        // Requisição PUT para atualizar os dados da sala
        await api.put('/salas/', updatedForm, { params: { uuid: updatedForm.uuid } });
        setMessage('Série editada com sucesso!');
        setExit(true); // Define a saída como verdadeira
        setAlert(true); // Exibe o alerta de sucesso
      } catch (error) {
        setMessage('Erro no servidor, tente novamente');
        setAlert(true); // Exibe o alerta de erro
        console.log(error);
      }
    }
  };

  // Função para lidar com a ação do alerta
  const alertAction = () => {
    if (exit) {
      setAlert(false); // Oculta o alerta
      props.setView('Listar'); // Define a visualização como 'Listar'
      props.reset && props.reset(); // Chama a função de redefinição, se existir
    } else {
      setAlert(false); // Oculta o alerta
    }
  };

  return (
    <>
      <h1 className='text-lg w-full px-2'>Editar Sala</h1>
      <div className='flex flex-wrap gap-x-4 p-2 w-full'>
        {/* Componente EleInput para o campo Nome */}
        <EleInput
          label='Nome'
          type='text'
          name='nome'
          value={form.nome}
          onChange={handleChangeForm}
        />
        {/* Componente EleInput para o campo Ano */}
        <EleInput
          label='Ano'
          type='select'
          data={anos}
          size='w-1/2'
          name='ano'
          value={form.ano}
          onChange={handleChangeForm}
        />
        {/* Componente EleInput para o campo Turno */}
        <EleInput
          label='Turno'
          type='select'
          data={turno}
          size='w-1/2'
          name='turno'
          value={form.turno}
          onChange={handleChangeForm}
        />
      </div>
      <div className='w-full flex'>
        {/* Botão EleButton para cancelar */}
        <EleButton onClick={() => props.setView('Listar')}>Cancelar</EleButton>
        {/* Botão EleButton para editar */}
        <EleButton onClick={handleSubmit}>Editar</EleButton>
      </div>
      {/* Componente EleAlert para exibir mensagens de alerta */}
      <EleAlert message={message} open={alert} setAlert={alertAction} />
    </>
  );
};

export default ModEditSala; // Exporta o componente ModEditSala
