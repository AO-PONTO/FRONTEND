import { EleButton, EleInput, EleAlert } from '@/components' // Importa componentes personalizados de botão, input e alerta
import { categoriaAdministrativa, etapaEnsino } from '@/data/selectsData' // Importa dados para seleção de categoria administrativa e etapa de ensino
import { cadEsc, dataEsc, propsView, typeCep } from '@/interface' // Importa tipos de dados de interface
import { formatDate, stringNumber } from '@/lib/utils' // Importa funções utilitárias
import api from '@/service/api' // Importa o módulo de serviço para fazer requisições à API
import axios from 'axios' // Importa o axios para fazer requisições HTTP
import React from 'react' // Importa a biblioteca React

interface Module {
  form: dataEsc, // Tipo de dados para o formulário da escola
  setView: React.Dispatch<React.SetStateAction<string>>, // Função para atualizar o estado da visualização
  reset?: Function // Função opcional para redefinir o estado
}

const ModEditEsc = (props: Module) => { // Declaração do componente funcional ModEditEsc

  const date = new Date // Cria uma instância da data atual

  // Define o estado do formulário da escola, do alerta e da saída
  const [form, setForm] = React.useState<cadEsc>(props.form)
  const [alert, setAlert] = React.useState<boolean>(false)
  const [exit, setExit] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState<string>('')

  // Função para lidar com a alteração dos valores do formulário
  const handleChangeForm = (value: string, label: string) => {
    if (label === 'cep') { // Verifica se o campo alterado é o CEP
      let valor = value.replace(/\D/g, '') // Remove todos os caracteres não numéricos do valor
      valor = valor.substring(0, 8) // Limita o valor a 8 caracteres

      pesquisacep(valor) // Chama a função para pesquisar o CEP

      valor = valor.replace(/(\d{5})(\d)/, '$1-$2'); // Formata o CEP

      setForm((prev) => ({ ...prev, 
        [label]: valor
      }))
    } else {
      setForm((prev) => ({ ...prev, 
        [label]: value
      }))
    }
  }

  // Função para lidar com o envio do formulário
  const handleSubmit = async () => {
    let updateForm = { ...form,
      cep: form.cep.replace('-',''),
      updated_at: date
    }
    if (updateForm.nome === '' ||
      updateForm.categoria_administrativa === '' ||
      updateForm.etapa_ensino === '' ||
      updateForm.inep_codigo === '' ||
      updateForm.cep === '' ||
      !stringNumber(updateForm.inep_codigo) ||
      !stringNumber(updateForm.cep)) {
      setMessage('Preencha todos os campos corretamente')
      setAlert(true)
    } else {
      try {
        await api.put('/escolas/', updateForm, { params: { uuid: updateForm.uuid }}) // Faz a requisição PUT para atualizar os dados da escola na API
        setMessage('Escola editada com sucesso!') // Define a mensagem de sucesso
        setExit(true) // Define a saída como verdadeira para fechar o modal após o sucesso
        setAlert(true) // Define o alerta como verdadeiro para exibir a mensagem
      } catch (error) {
        setMessage('Erro no servidor, tente novamente') // Define a mensagem de erro
        setAlert(true) // Define o alerta como verdadeiro para exibir a mensagem
        console.log(error) // Log de erro, se houver algum problema na requisição
      }
    }
  }

  // Função para pesquisar o CEP
  const pesquisacep = (value: string) => {
    if (value.length >= 8) { // Verifica se o CEP tem pelo menos 8 caracteres
    axios.get('https://viacep.com.br/ws/'+ value + '/json/') // Faz uma requisição GET para o serviço ViaCEP
      .then((response: any) => {
        if(response.statusText === 'OK') { // Verifica se a requisição foi bem-sucedida
          setForm((prev) => ({ ...prev, 
            municipio: response.data.localidade, // Define o município com base na resposta do serviço
            uf: response.data.uf, // Define o estado com base na resposta do serviço
            endereco: response.data.logradouro + ', ' + response.data.bairro + '. ' + response.data.cep + ' ' + response.data.localidade + ' - ' + response.data.uf // Define o endereço completo com base na resposta do serviço
          }))
        } else {
          console.log('Nenhum valor encontrado') // Log se nenhum valor for encontrado
        }
      })
    };
  }

  // Função para lidar com a ação do alerta
  const alertAction = () => {
    if(exit) {
      setAlert(false) // Fecha o alerta
      props.setView('Listar') // Retorna para a visualização de listagem
      props.reset && props.reset() // Reseta o estado, se a função reset estiver definida
    } else {
      setAlert(false) // Fecha o alerta
    }
  }

  return (
    <>
      <h1 className="text-lg w-full px-2">Cadastrar Escolas</h1>
      <div className='flex flex-wrap gap-x-4 p-2 w-full'>
        {/* Componentes de input para editar os dados da escola */}
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
            disabled
        />
        <EleInput 
            label='Unidade Federal'
            type='text'
            name='uf'
            value={form.uf}
            size='w-1/2'
            disabled
        />
        <EleInput 
            label='Endereço'
            type='text'
            name='endereco'
            value={form.endereco}
            disabled
        />
      </div>
      <div className='w-full flex'>
        <EleButton onClick={() => props.setView('Listar')}>Cancelar</EleButton> {/* Botão para cancelar a edição */}
        <EleButton onClick={handleSubmit}>Editar</EleButton> {/* Botão para enviar o formulário de edição */}
      </div>
      <EleAlert 
        message={message}
        open={alert}
        setAlert={alertAction}/>
    </>
  )
}

export default ModEditEsc // Exporta o componente ModEditEsc
