import { EleButton, EleInput, EleAlert } from '@/components'; // Importa componentes EleButton, EleInput e EleAlert do diretório '@/components'
import { dataAluno } from '@/interface'; // Importa a interface dataAluno do diretório '@/interface'
import api from '@/service/api'; // Importa o módulo api do diretório '@/service/api'
import React from 'react'; // Importa React do pacote react

interface Module {
  form: dataAluno; // Interface para o formulário do aluno
  setView: React.Dispatch<React.SetStateAction<string>>; // Função para atualizar a visualização
  reset?: Function; // Função opcional para redefinir o estado
}

const ModEditAluno = (props: Module) => {
  const date = new Date(); // Obtém a data atual

  const [form, setForm] = React.useState<dataAluno>(props.form); // Estado para o formulário do aluno
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
    if (
      updatedForm.data_nascimento === '' ||
      updatedForm.matricula === '' ||
      updatedForm.nome === ''
    ) {
      setMessage('Preencha todos os campos corretamente');
      setAlert(true);
    } else {
      try {
        // Requisição PUT para atualizar os dados do aluno
        await api.put('/alunos/', updatedForm, { params: { uuid: updatedForm.uuid } });
        setMessage('Usuário editado com sucesso!');
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
      <h1 className='text-lg w-full px-2'>Editar Aluno</h1>
      <div className='flex flex-wrap gap-x-4 p-2 w-full'>
        {/* Componente EleInput para o campo Nome */}
        <EleInput
          label='Nome'
          type='text'
          name='nome'
          value={form.nome}
          onChange={handleChangeForm}
        />
        {/* Componente EleInput para o campo Data de Nascimento */}
        <EleInput
          label='Data de Nascimento'
          type='date'
          size='w-1/2'
          name='data_nascimento'
          value={form.data_nascimento}
          onChange={handleChangeForm}
        />
        {/* Componente EleInput para o campo Matrícula */}
        <EleInput
          label='Matrícula'
          type='text'
          name='matricula'
          size='w-1/2'
          value={form.matricula.toString()}
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

export default ModEditAluno; // Exporta o componente ModEditAluno
