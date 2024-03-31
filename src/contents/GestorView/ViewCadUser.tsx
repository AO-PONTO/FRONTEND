import { EleButton, EleInput, EleAlert } from '@/components'; // Importa componentes personalizados de botão, input e alerta
import { cadUser, papelRequest, propSelect, propsView } from '@/interface'; // Importa tipos de dados de interface
import api from '@/service/api'; // Importa o módulo de serviço para fazer requisições à API
import { formatDate, stringNumber } from '@/lib/utils'; // Importa funções utilitárias
import uuid from 'react-uuid'; // Importa a função para gerar UUIDs únicos
import React from 'react'; // Importa a biblioteca React

const ViewCadUser = (props: propsView) => { // Declaração do componente funcional ViewCadUser

  const date = new Date(); // Cria uma instância da data atual

  // Define o estado para os papéis de usuário, acesso, escolas, formulário de cadastro, alerta, saída e mensagem
  const [papel, setPapel] = React.useState<propSelect[]>([]); // Papéis de usuário disponíveis
  const [access, setAccess] = React.useState<papelRequest[]>([]); // Níveis de acesso dos usuários
  const [escola, setEscola] = React.useState<propSelect[]>([]); // Escolas disponíveis
  const [form, setForm] = React.useState<cadUser>({ // Estado para o formulário de cadastro de usuário
    nome: '', // Nome do usuário
    access_level: '', // Nível de acesso do usuário
    active: true, // Status do usuário (ativo ou inativo)
    cpf: '', // CPF do usuário
    created_at: formatDate(date), // Data de criação do usuário
    data_nascimento: '', // Data de nascimento do usuário
    email: '', // E-mail do usuário
    escola_name: '', // Nome da escola associada ao usuário
    escola_uuid: '', // UUID da escola associada ao usuário
    papel_name: '', // Nome do papel do usuário
    papel_uuid: '', // UUID do papel do usuário
    senha: '', // Senha do usuário
    updated_at: null, // Data de atualização do usuário (inicialmente nula)
    uuid: uuid() // UUID único para o usuário
  });
  const [alert, setAlert] = React.useState<boolean>(false); // Estado para controlar a exibição do alerta
  const [exit, setExit] = React.useState<boolean>(false); // Estado para controlar a saída após o cadastro
  const [message, setMessage] = React.useState<string>(''); // Mensagem a ser exibida no alerta
  
  // Função para buscar as escolas disponíveis na API
  const handleEscolas = async () => {
    try {
      const response = await api.get('/escolas', { params: { all: true } }); // Faz a requisição GET para obter todas as escolas
      if (response) {
        const temp = response.data.map((item: { uuid: any; nome: any }) => { // Mapeia os dados das escolas para o formato desejado
          return {
            uuid: item.uuid,
            name: item.nome
          };
        });
        setEscola(temp); // Atualiza o estado das escolas com os dados obtidos
      }
    } catch (error) {
      console.log(error); // Registra qualquer erro ocorrido durante a requisição
    }
  };

  // Função para buscar os papéis de usuário disponíveis na API
  const handlePapel = async () => {
    try {
      const response = await api.get('/papel', { params: { all: true } }); // Faz a requisição GET para obter todos os papéis de usuário
      if (response) {
        const temp = response.data.map((item: papelRequest) => { // Mapeia os dados dos papéis de usuário para o formato desejado
          if (item.access_level <= 5) { // Verifica se o nível de acesso do papel é menor ou igual a 5
            return {
              uuid: item.uuid,
              name: item.nome
            };
          }
          return null;
        }).filter((ele: null) => ele !== null); // Filtra os elementos nulos
        setPapel(temp); // Atualiza o estado dos papéis de usuário com os dados obtidos

        const temp2 = response.data.map((item: papelRequest) => { // Mapeia novamente os dados dos papéis de usuário para obter os níveis de acesso
          if (item.access_level <= 5) { // Verifica se o nível de acesso do papel é menor ou igual a 5
            return item;
          }
          return null;
        }).filter((ele: null) => ele !== null); // Filtra os elementos nulos
        setAccess(temp2); // Atualiza o estado dos níveis de acesso com os dados obtidos
      }
    } catch (error) {
      console.log(error); // Registra qualquer erro ocorrido durante a requisição
    }
  };

  // Função para lidar com a alteração dos valores do formulário
  const handleChangeForm = (value: string, label: string) => {
    if (label === 'cpf') { // Se o campo alterado for o CPF
      let valor = value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
      valor = valor.substring(0, 11); // Limita o tamanho do CPF para 11 caracteres

      valor = valor.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona um ponto após os primeiros três dígitos
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona um ponto após os próximos três dígitos
      valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona um hífen após os últimos três dígitos

      setForm((prev) => ({ ...prev, [label]: valor })); // Atualiza o estado do formulário com o CPF formatado
    } else { // Se o campo alterado não for o CPF
      setForm((prev) => ({ ...prev, [label]: value })); // Atualiza o estado do formulário com o valor do campo alterado
    }
  };

  // Função para lidar com o envio do formulário de cadastro de usuário
  const handleSubmit = async () => {
    let updatedForm = { ...form, cpf: form.cpf.replace(/[.-]/g,'') }; // Remove pontos e hífens do CPF antes de enviar

    // Verifica se todos os campos obrigatórios foram preenchidos corretamente
    if (
      updatedForm.cpf === '' ||
      updatedForm.data_nascimento === '' ||
      updatedForm.escola_uuid === '' ||
      updatedForm.papel_uuid === '' ||
      updatedForm.email === '' ||
      updatedForm.senha === '' ||
      !stringNumber(updatedForm.cpf) // Verifica se o CPF contém apenas números
    ) {
      setMessage('Preencha todos os campos corretamente'); // Define a mensagem de erro
      setAlert(true); // Exibe o alerta de erro
    } else {
      try {
        await api.post('/usuario/', updatedForm); // Faz a requisição POST para cadastrar o usuário na API
        setMessage('Usuário cadastrado com sucesso!'); // Define a mensagem de sucesso
        setExit(true); // Define a saída como verdadeira
        setAlert(true); // Exibe o alerta de sucesso
      } catch (error) {
        setMessage('Erro ao cadastrar usuário'); // Define a mensagem de erro
        setAlert(true); // Exibe o alerta de erro
        console.log(error); // Registra o erro no console
      }
    }
  };

  // Efeito colateral para buscar as escolas e os papéis de usuário disponíveis ao carregar o componente
  React.useEffect(() => {
    handleEscolas(); // Busca as escolas disponíveis
    handlePapel(); // Busca os papéis de usuário disponíveis
  }, []);

  // Efeito colateral para atualizar o formulário com os nomes da escola e do papel de usuário selecionados
  React.useEffect(() => {
    const papelName = papel.find(item => item.uuid === form.papel_uuid); // Encontra o papel de usuário selecionado
    const escolaName = escola.find(item => item.uuid === form.escola_uuid); // Encontra a escola selecionada
    const accessLevel = access.find(item => item.uuid === form.papel_uuid); // Encontra o nível de acesso do usuário

    if (escolaName !== undefined) {
      setForm(prev => ({ ...prev, escola_name: escolaName.name })); // Atualiza o estado do formulário com o nome da escola
    }

    if (papelName !== undefined) {
      setForm(prev => ({ ...prev, papel_name: papelName.name })); // Atualiza o estado do formulário com o nome do papel de usuário
    }

    if (accessLevel !== undefined) {
      setForm(prev => ({ ...prev, access_level: accessLevel.access_level.toString() })); // Atualiza o estado do formulário com o nível de acesso do usuário
    }
  }, [escola, papel, access, form.escola_uuid, form.papel_uuid]); // Dependências do efeito colateral

  // Função para controlar a ação do alerta
  const alertAction = () => {
    if (exit) {
      setAlert(false); // Define o alerta como falso para fechar o modal
      props.setView('Listar'); // Redireciona para a visualização de listagem de usuários
    } else {
      setAlert(false); // Define o alerta como falso para fechar o modal
    }
  };

  return (
    <> {/* Fragmento React */}
      <h1 className='text-lg w-full px-2'>Cadastrar Usuários</h1> {/* Título do formulário */}
      <div className='flex flex-wrap gap-x-4 p-2'> {/* Div contendo os inputs do formulário */}
        <EleInput 
          label='Nome Completo'
          type='text'
          name='nome'
          value={form.nome}
          onChange={handleChangeForm}
        />
        <EleInput 
          label='CPF'
          type='text'
          size='w-1/2'
          name='cpf'
          value={form.cpf}
          onChange={handleChangeForm}
        />
        <EleInput 
          label='Data de Nascimento'
          type='date'
          size='w-1/2'
          name='data_nascimento'
          value={form.data_nascimento}
          onChange={handleChangeForm}
        />
        <EleInput 
          label='Escola'
          type='select'
          data={escola}
          size='w-1/2'
          name='escola_uuid'
          value={form.escola_uuid}
          onChange={handleChangeForm}
        />
        <EleInput 
          label='Função'
          type='select'
          data={papel}
          size='w-1/2'
          name='papel_uuid'
          value={form.papel_uuid}
          onChange={handleChangeForm}
        />
        <EleInput 
          label='E-mail'
          type='text'
          name='email'
          value={form.email}
          onChange={handleChangeForm}
        />
        <EleInput 
          label='Senha'
          type='password'
          size='w-1/2'
          name='senha'
          value={form.senha}
          onChange={handleChangeForm}
        />
      </div>
      <EleButton onClick={handleSubmit}>Cadastrar</EleButton> {/* Botão para enviar o formulário de cadastro */}
      <EleAlert 
        message={message}
        open={alert}
        setAlert={alertAction}
      /> {/* Alerta para exibir mensagens de sucesso ou erro */}
    </>
  );
};

export default ViewCadUser; // Exporta o componente ViewCadUser
