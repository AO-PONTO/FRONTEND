
import { EleButton, EleInput, EleAlert } from '@/components' // Importação de componentes de interface
import { cardapioRequest, dataCardEsc, propSelect } from '@/interface' // Importação de tipos e interfaces
import api from '@/service/api' // Importação do módulo de API
import React from 'react' // Importação do React


interface Module {
  form: dataCardEsc,
  setView: React.Dispatch<React.SetStateAction<string>>,
  reset?: Function
}

// Componente de edição de atribuição
const ModEditAtr = (props: Module) => {

  // Opções de dia da semana e turno
  const diaSemana: propSelect[] = [
    { name: 'segunda', uuid: 'segunda' },
    { name: 'terça', uuid: 'terça' },
    { name: 'quarta', uuid: 'quarta' },
    { name: 'quinta', uuid: 'quinta' },
    { name: 'sexta', uuid: 'sexta' }
  ]

  const turno: propSelect[] = [
    { name: 'matutino', uuid: 'matutino' },
    { name: 'vespertino', uuid: 'vespertino' },
    { name: 'noturno', uuid: 'noturno' }
  ]

  const date = new Date // Objeto de data atual

    // Estados do componente
  const [cardapioSubmit, setCardapioSubmit] = React.useState<cardapioRequest[]>([])
  const [cardapio, setCardapio] = React.useState<propSelect[]>([])
  const [form, setForm] = React.useState<dataCardEsc>(props.form)
  const [alert, setAlert] = React.useState<boolean>(false)
  const [exit, setExit] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState<string>('')
  
    // Função para lidar com a busca dos cardápios disponíveis
  const handleCardapio = async () => {
    try {
      const response = await api.get('/cardapio', { params: { all: true } })
      if (response) {
        // Formatação dos dados dos cardápios para seleção
        const temp = response.data.map((item:cardapioRequest) => {
          return {
            uuid: item.uuid,
            name: item.nome
          }})
        setCardapio(temp)
        const temp2 = response.data.map((item:cardapioRequest) => {
            return {
              nome: item.nome,
              uuid: item.uuid,
              descricao: item.descricao
            }})
        setCardapioSubmit(temp2)
      }
    } catch (error) {
      console.log(error)
    }
  }

    // Função para lidar com a alteração dos campos do formulário
  const handleChangeForm = (value: string, label: string) => {
    setForm((prev) => ({ ...prev, 
      [label]: value
    }))
  }

    // Função para lidar com o envio do formulário
  const handleSubmit = async () => {
    let updatedForm = form
    if(updatedForm.cardapio_uuid === '' ||
    updatedForm.dia_da_semana === '' ||
    updatedForm.turno === '') {
      // Verificação se todos os campos obrigatórios foram preenchidos
      setMessage('Preencha todos os campos corretamente')
      setAlert(true)
    } else {
      try {
          // Requisição PUT para atualizar a atribuição
        await api.put('/cardapio-escola/', updatedForm, { params: { uuid: updatedForm.uuid }})
        setMessage('Atribuição editada com sucesso!')
        setExit(true)
        setAlert(true)
        props.reset && props.reset()
      } catch (error) {
        setMessage('Erro no servidor, tente novamente')
        setAlert(true)
        console.log(error)
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
    if(exit) {
      setAlert(false)
      props.setView('Listar')
    } else {
      setAlert(false)
    }
  }
  
  // Retorno do componente
  return (
    <>
      {/* Título do formulário */}
      <h1 className='text-lg w-full px-2'>Editar Atribuição</h1>
      {/* Formulário de edição de atribuição */}
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
      {/* Botões de ação */}
      <div className='w-full flex'>
        <EleButton onClick={() => props.setView('Listar')}>Cancelar</EleButton>
        <EleButton onClick={handleSubmit}>Editar</EleButton>
      </div>
      {/* Alerta para exibir mensagens */}
      <EleAlert
        message={message}
        open={alert}
        setAlert={alertAction} />
    </>
  )
}

export default ModEditAtr // Exportação do componente