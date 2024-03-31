import { EleButton, EleInput, EleAlert } from '@/components' // Importação de componentes de interface
import { cadCardEsc, cardapioRequest, papelRequest, propSelect, propsView } from '@/interface' // Importação de tipos e interfaces específicos
import api from '@/service/api' // Importação do módulo de API
import { formatDate, stringNumber } from '@/lib/utils' // Importação de funções utilitárias
import uuid from 'react-uuid' // Importação da biblioteca para geração de UUID
import React from 'react' // Importação do React

// Definição da interface para o componente
const ViewCadAtr = (props: propsView) => {

  // Array de objetos para os dias da semana
  const diaSemana: propSelect[] = [
    { name: 'segunda', uuid: 'segunda' },
    { name: 'terça', uuid: 'terça' },
    { name: 'quarta', uuid: 'quarta' },
    { name: 'quinta', uuid: 'quinta' },
    { name: 'sexta', uuid: 'sexta' }
  ]

  // Array de objetos para os turnos
  const turno: propSelect[] = [
    { name: 'matutino', uuid: 'matutino' },
    { name: 'vespertino', uuid: 'vespertino' },
    { name: 'noturno', uuid: 'noturno' }
  ]

  const date = new Date // Objeto de data atual

  // Estados do componente
  const [cardapioSubmit, setCardapioSubmit] = React.useState<cardapioRequest[]>([]) // Estado para os cardápios
  const [cardapio, setCardapio] = React.useState<propSelect[]>([]) // Estado para as opções de cardápio
  const [form, setForm] = React.useState<cadCardEsc>({ // Estado para o formulário de atribuição de cardápio
    cardapio_descricao: '',
    cardapio_name: '',
    cardapio_uuid: '',
    created_at: formatDate(date),
    dia_da_semana: '',
    escola_uuid: '',
    turno: '',
    updated_at: null,
    uuid: uuid()
  })
  const [alert, setAlert] = React.useState<boolean>(false) // Estado para o alerta
  const [exit, setExit] = React.useState<boolean>(false) // Estado para sinalizar saída
  const [message, setMessage] = React.useState<string>('') // Estado para a mensagem do alerta

  // Função para obter os cardápios disponíveis
  const handleCardapio = async () => {
    try {
      const response = await api.get('/cardapio', { params: { all: true } }) // Requisição GET para obter os cardápios
      if (response) {
        // Mapeamento dos dados da resposta para o formato desejado
        const temp = response.data.map((item: cardapioRequest) => {
          return {
            uuid: item.uuid,
            name: item.nome
          }
        })
        setCardapio(temp) // Definindo as opções de cardápio
        const temp2 = response.data.map((item: cardapioRequest) => {
          return {
            nome: item.nome,
            uuid: item.uuid,
            descricao: item.descricao
          }
        })
        setCardapioSubmit(temp2) // Definindo os cardápios para submissão
      }
    } catch (error) {
      console.log(error) // Lidando com erros
    }
  }

  // Função para lidar com a mudança nos campos do formulário
  const handleChangeForm = (value: string, label: string) => {
    setForm((prev) => ({ ...prev, [label]: value }))
  }

  // Função para lidar com o envio do formulário
  const handleSubmit = async () => {
    const dataUser = localStorage.getItem('@aplication/aoponto') // Obtendo dados do usuário armazenados localmente
    if (dataUser) {
      const tempUser = JSON.parse(dataUser) // Convertendo os dados do usuário para objeto
      let updatedForm = { ...form,
        escola_uuid: tempUser.user.escola_uuid // Adicionando o UUID da escola ao formulário
      }
      if (updatedForm.cardapio_uuid === '' ||
        updatedForm.dia_da_semana === '' ||
        updatedForm.turno === '') {
        // Verificando se todos os campos obrigatórios foram preenchidos
        setMessage('Preencha todos os campos corretamente')
        setAlert(true) // Exibindo alerta
      } else {
        try {
          await api.post('/cardapio-escola/', updatedForm) // Requisição POST para atribuir o cardápio à escola
          setMessage('Cardápio atribuído com sucesso!') // Definindo mensagem de sucesso
          setExit(true) // Marcando a saída como verdadeira
          setAlert(true) // Exibindo alerta
        } catch (error) {
          setMessage('Erro no servidor, tente novamente') // Definindo mensagem de erro
          setAlert(true) // Exibindo alerta
          console.log(error) // Lidando com erros
        }
      }
    }
  }

  // Efeito para carregar os cardápios disponíveis ao montar o componente
  React.useEffect(()=> {
    handleCardapio()
  }, [])

  // Efeito para atualizar o nome e descrição do cardápio selecionado
  React.useEffect(()=> {
    const cardapioName = cardapioSubmit.find(item => item.uuid === form.cardapio_uuid)

    if (cardapioName !== undefined) {
      setForm(prev => ({...prev,
        cardapio_name: cardapioName.nome,
        cardapio_descricao: cardapioName.descricao
      }))
    }
  }, [cardapioSubmit, form.cardapio_uuid])

  // Função para lidar com a ação do alerta
  const alertAction = () => {
    if (exit) {
      setAlert(false) // Ocultando o alerta
      props.setView('Listar') // Mudando a visualização para listar os cardápios atribuídos
    } else {
      setAlert(false) // Ocultando o alerta
    }
  }

  // Retorno do componente
  return (
    <>
      {/* Título do formulário */}
      <h1 className='text-lg w-full px-2'>Atribuir Cardápio</h1>
      {/* Formulário para atribuir cardápio */}
      <div className='flex flex-wrap gap-x-4 p-2 w-full'>
        <EleInput 
          label='Cardápio'
          type='select'
          data={cardapio}
          size='w-1/2'
          name='cardapio_uuid'
          value={form.cardapio_uuid}
          onChange={handleChangeForm}
        />
        <EleInput 
          label='Dia da Semana'
          type='select'
          data={diaSemana}
          size='w-1/2'
          name='dia_da_semana'
          value={form.dia_da_semana}
          onChange={handleChangeForm}
        />
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
      {/* Botão para cadastrar a atribuição */}
      <EleButton onClick={handleSubmit}>Cadastrar</EleButton>
      {/* Alerta para exibir mensagens */}
      <EleAlert 
        message={message}
        open={alert}
        setAlert={alertAction}
      />
    </>
  )
}

export default ViewCadAtr // Exportação do componente
