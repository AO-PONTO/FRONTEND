import { EleButton, EleInput, EleAlert } from '@/components' // Importa componentes personalizados de botão, input e alerta
import { categoriaAdministrativa, etapaEnsino } from '@/data/selectsData' // Importa opções para seleção de categoria administrativa e etapa de ensino
import { cadEsc, propsView, typeCep } from '@/interface' // Importa tipos de dados de interface
import { formatDate, stringNumber } from '@/lib/utils' // Importa funções utilitárias
import api from '@/service/api' // Importa o módulo de serviço para fazer requisições à API
import axios from 'axios' // Importa a biblioteca axios para fazer requisições HTTP
import uuid from 'react-uuid' // Importa a função para gerar UUIDs únicos
import React from 'react' // Importa a biblioteca React

const ViewCadEsc = (props: propsView) => { // Declaração do componente funcional ViewCadEsc

  const date = new Date // Cria uma instância da data atual

  // Define o estado para o formulário da escola, o alerta, a saída e a mensagem
  const [form, setForm] = React.useState<cadEsc>({
    categoria_administrativa: '', // Categoria administrativa da escola
    cep: '', // CEP da escola
    created_at: formatDate(date), // Data de criação da escola
    endereco: '', // Endereço da escola
    etapa_ensino: '', // Etapa de ensino da escola
    inep_codigo: '', // Código INEP da escola
    municipio: '', // Município da escola
    nome: '', // Nome da escola
    uf: '', // Unidade Federal da escola
    updated_at: null, // Data de atualização da escola (inicialmente nula)
    uuid: uuid() // UUID único para a escola
  })
  const [alert, setAlert] = React.useState<boolean>(false) // Estado para controlar a exibição do alerta
  const [exit, setExit] = React.useState<boolean>(false) // Estado para controlar a saída após o cadastro
  const [message, setMessage] = React.useState<string>('') // Mensagem a ser exibida no alerta

  // Função para lidar com a alteração dos valores do formulário
  const handleChangeForm = (value: string, label: string) => {
    if (label === 'cep') { // Verifica se o campo alterado é o CEP
      let valor = value.replace(/\D/g, '') // Remove caracteres não numéricos do valor do CEP
      valor = valor.substring(0, 8) // Limita o CEP a 8 dígitos

      pesquisacep(valor) // Chama a função para pesquisar o CEP

      valor = valor.replace(/(\d{5})(\d)/, '$1-$2'); // Formata o CEP com hífen

      setForm((prev) => ({ ...prev, 
        [label]: valor // Atualiza o valor do CEP no estado do formulário
      }))
    } else {
      setForm((prev) => ({ ...prev, 
        [label]: value // Atualiza o valor do campo no estado do formulário
      }))
    }
  }

  // Função para lidar com o envio do formulário
  const handleSubmit = async () => {
    let updateForm = { ...form,
      cep: form.cep.replace('-','') // Remove o hífen do CEP antes de enviar para a API
    }
    if (updateForm.nome === '' ||
      updateForm.categoria_administrativa === '' ||
      updateForm.etapa_ensino === '' ||
      updateForm.inep_codigo === '' ||
      updateForm.cep === '' ||
      !stringNumber(updateForm.inep_codigo) || // Verifica se o código INEP é um número
      !stringNumber(updateForm.cep)) { // Verifica se o CEP é um número
      setMessage('Preencha todos os campos corretamente') // Define a mensagem de erro
      setAlert(true) // Define o alerta como verdadeiro para exibir a mensagem
    } else {
      try {
        await api.post('/escolas/', updateForm) // Faz a requisição POST para cadastrar a escola na API
        setMessage('Escola cadastrada com sucesso!') // Define a mensagem de sucesso
        setExit(true) // Define a saída como verdadeira para fechar o modal após o sucesso
        setAlert(true) // Define o alerta como verdadeiro para exibir a mensagem
      } catch (error) {
        setMessage('Erro no servidor, tente novamente') // Define a mensagem de erro
        setAlert(true) // Define o alerta como verdadeiro para exibir a mensagem
        console.log(error) // Log de erro, se houver algum problema na requisição
      }
    }
  }

  // Função para pesquisar o CEP utilizando a API ViaCEP
  const pesquisacep = (value: string) => {
    if (value.length >= 8) { // Verifica se o valor do CEP tem pelo menos 8 caracteres
    axios.get('https://viacep.com.br/ws/'+ value + '/json/') // Faz a requisição GET para a API ViaCEP
      .then((response: any) => { // Manipula a resposta da requisição
        if(response.statusText === 'OK') { // Verifica se a requisição foi bem-sucedida
          setForm((prev) => ({ ...prev, 
            municipio: response.data.localidade, // Atualiza o município no estado do formulário
            uf: response.data.uf, // Atualiza a unidade federal no estado do formulário
            endereco: response.data.logradouro + ', ' + response.data.bairro + '. ' + response.data.cep + ' ' + response.data.localidade + ' - ' + response.data.uf // Atualiza o endereço no estado do formulário
          }))
        } else {
          console.log('Nenhum valor encontrado') // Mensagem de log se nenhum valor for encontrado
        }
      })
    };
  }

  // Função para lidar com a ação do alerta (fechar ou redirecionar)
  const alertAction = () => {
    if(exit) {
      setAlert(false) // Define o alerta como falso para fechar o modal
      props.setView('Listar') // Redireciona para a visualização de listagem de escolas
    } else {
      setAlert(false) // Define o alerta como falso para fechar o modal
    }
  }

  return (
    <> {/* Fragmento React */}
      <h1 className="text-lg w-full px-2">Cadastrar Escolas</h1> {/* Título do formulário */}
      <div className='flex flex-wrap gap-x-4 p-2 w-full'> {/* Div contendo os inputs do formulário */}
        <EleInput 
            label='Nome da Escola'
            type='text'
            name='nome'
            value={form.nome}
            onChange={handleChangeForm}
        />
        <EleInput 
            label='Categoria Administrativa'
            type='select'
            name='categoria_administrativa'
            value={form.categoria_administrativa}
            onChange={handleChangeForm}
            data={categoriaAdministrativa}
            size='w-1/2'
        />
        <EleInput 
            label='Etapa de Ensino'
            type='select'
            name='etapa_ensino'
            value={form.etapa_ensino}
            onChange={handleChangeForm}
            data={etapaEnsino}
            size='w-1/2'
        />
        <EleInput 
            label='Código do INEP'
            type='text'
            name='inep_codigo'
            value={form.inep_codigo}
            onChange={handleChangeForm}
            size='w-1/2'
        />
        <EleInput 
            label='CEP'
            type='text'
            name='cep'
            value={form.cep}
            onChange={handleChangeForm}
            size='w-1/2'
        />
        <EleInput 
            label='Município'
            type='text'
            name='municipio'
            value={form.municipio}
            size='w-1/2'
            disabled // Desabilita o input do município
        />
        <EleInput 
            label='Unidade Federal'
            type='text'
            name='uf'
            value={form.uf}
            size='w-1/2'
            disabled // Desabilita o input da unidade federal
        />
        <EleInput 
            label='Endereço'
            type='text'
            name='endereco'
            value={form.endereco}
            disabled // Desabilita o input do endereço
        />
      </div>
      <EleButton onClick={handleSubmit}>Cadastrar</EleButton> {/* Botão para enviar o formulário de cadastro */}
      <EleAlert 
        message={message}
        open={alert}
        setAlert={alertAction}/> {/* Componente de alerta para exibir mensagens de sucesso ou erro */}
    </>
  )
}

export default ViewCadEsc // Exporta o componente ViewCadEsc
