import React from 'react'
import * as Components from '@/components' // Importa todos os componentes do diretório '@/components'
import api from '@/service/api' // Importa a API de serviço
import { Logo1 } from '@/assets' // Importa o componente Logo1 do diretório '@/assets'
import Image from 'next/image' // Importa o componente de imagem do Next.js

interface propsLogin {
  setLogged: React.Dispatch<React.SetStateAction<boolean>> // Função para definir se o usuário está logado
  setLogin: React.Dispatch<React.SetStateAction<number>> // Função para definir o nível de acesso do usuário
  pass: string // Senha do usuário
}

const Login = (props: propsLogin) => {
  const [login, setLogin] = React.useState<string>('') // Estado para armazenar o nome de usuário
  const [pass, setPass] = React.useState<string>('') // Estado para armazenar a senha
  const [alert, setAlert] = React.useState<boolean>(false) // Estado para controlar a exibição do alerta
  const [message, setMessage] = React.useState<string>('') // Estado para armazenar a mensagem do alerta
  const [newPass, setNewPass] = React.useState<boolean>(false) // Estado para controlar a exibição do formulário de recuperação de senha
  const [step, setStep] = React.useState<string>('1') // Estado para controlar o passo do processo de recuperação de senha
  const [email, setEmail] = React.useState<string>('') // Estado para armazenar o email do usuário
  const [token, setToken] = React.useState<string>('') // Estado para armazenar o token de autenticação
  const [code, setCode] = React.useState<string>('') // Estado para armazenar o código de verificação
  const [newPassword, setNewPassword] = React.useState<string>('') // Estado para armazenar a nova senha

  // Função para lidar com o login do usuário
  const handleLogin = async () => {
    if (login.length === 0 || pass.length === 0) {
      setMessage('Insira as informações de login')
      setAlert(true)
    } else {
      try {
        const response = await api.post('/login/access-token', { username: login.replace(/[.-]/g, ''), password: pass })
        if (response) {
          localStorage.setItem(
            '@aplication/aoponto',
            JSON.stringify(response.data)
          )
          props.setLogin(response.data.user.access_level)
          props.setLogged(true)
        }
      } catch (error: any) {
        console.log(error)
        setMessage(error.response.data.detail)
        setAlert(true)
      }
    }
  }

  // Função para formatar o login do usuário
  const getLogin = (value: string, label: string) => {
    let valor = value.replace(/\D/g, '')
    valor = valor.substring(0, 11)

    valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2')

    setLogin(valor)
  }

  // Função para armazenar a senha do usuário
  const getPass = (value: string, name: string) => {
    setPass(value)
  }

  // Função para armazenar o email do usuário
  const getEmail = (value: string, name: string) => {
    setEmail(value)
  }

  // Função para armazenar o código de verificação
  const getCode = (value: string, name: string) => {
    setCode(value)
  }

  // Função para armazenar a nova senha do usuário
  const getNewPassword = (value: string, name: string) => {
    setNewPassword(value)
  }

  // Função para fechar o alerta
  const alertAction = () => {
    setAlert(false)
  }

  // Função para enviar o email e avançar para o próximo passo
  const emailStep = async () => {
    try {
      const response = await api.post('/forgot-my-password/', { email })
      setToken(response.data.token)
    } catch (erro) {
      console.log(erro)
      setMessage('Erro Interno no servidor')
      setAlert(true)
    } finally {
      setStep('2')
    }
  }

  // Função para enviar o código de verificação e avançar para o próximo passo
  const codeStep = async () => {
    try {
      const response = await api.post('/forgot-my-password/code', { params: { code, Authentication: token } })
      setToken(response.data.token)
    } catch (erro) {
      console.log(erro)
      setMessage('Erro Interno no servidor')
      setAlert(true)
    } finally {
      setStep('3')
    }
  }

  // Função para definir uma nova senha
  const newPasswordStep = async () => {
    try {
      await api.post('/new-password', { password: newPassword }, { params: { Authentication: token } })
    } catch (erro) {
      console.log(erro)
      setMessage('Erro Interno no servidor')
      setAlert(true)
    } finally {
      setMessage('Senha Alterada com sucesso!')
      setAlert(true)
      setStep('1')
      setNewPass(false)
      setEmail('')
      setCode('')
      setToken('')
      setNewPassword('')
    }
  }

  return (
    <>
      {/* Renderiza um container estilizado */}
      <Components.EstContainer size='small' shadow='center' rounded='medium'>
        {/* Verifica se está no modo de recuperação de senha */}
        {newPass ? (
          <>
            {/* Renderiza o formulário de recuperação de senha */}
            <div className='flex flex-col w-full p-2 gap-2s'>
              {/* Verifica o passo atual do processo */}
              {step === '1' ? (
                <>
                  <h1 className="text-center text-2xl font-medium pb-4">Informe seu Email</h1>
                  {/* Renderiza o campo de email */}
                  <Components.EleInput
                    type="text"
                    name="email"
                    label="Email"
                    value={email}
                    onChange={getEmail}
                  />
                </>
              ) : step === '2' ? (
                <>
                  <h1 className="text-center text-2xl font-medium pb-4">Informe o Código</h1>
                  {/* Renderiza o campo de código de verificação */}
                  <Components.EleInput
                    type="text"
                    name="code"
                    label="Código"
                    value={code}
                    onChange={getCode}
                  />
                </>
              ) : (
                <>
                  <h1 className="text-center text-2xl font-medium pb-4">Informe a Nova Senha</h1>
                  {/* Renderiza o campo de nova senha */}
                  <Components.EleInput
                    type="password"
                    name="new_pass"
                    label="Nova Senha"
                    value={newPassword}
                    onChange={getNewPassword}
                  />
                </>
              )}
            </div>
            {/* Renderiza os botões de ação */}
            <div className="flex justify-between gap-2 w-full">
              {/* Botão para voltar ao modo de login */}
              <Components.EleButton onClick={() => setNewPass(false)}>
                Voltar
              </Components.EleButton>
              {/* Botão para avançar no processo */}
              <Components.EleButton onClick={() => {
                if (step === '1') {
                  emailStep()
                } else if (step === '2') {
                  codeStep()
                } else if (step === '3') {
                  newPasswordStep()
                }
              }}>Avançar</Components.EleButton>
            </div>
          </>
        ) : (
          <>
            <div className='flex flex-col w-full p-2 gap-2s'>
              {/* Renderiza o logo */}
              <Image
                src={Logo1}
                alt='Logo'
                height={500}
                width={500}
                className='w-full h-fit'
              />
              {/* Renderiza o campo de nome de usuário */}
              <Components.EleInput
                type='text'
                label='Usuario'
                name='login'
                value={login}
                onChange={getLogin}
              />
              {/* Renderiza o campo de senha */}
              <Components.EleInput
                type='password'
                label='Senha'
                name='senha'
                value={pass}
                onChange={getPass}
              />
            </div>
            {/* Botão para recuperação de senha */}
            <button className='px-4 text-sm' onClick={() => setNewPass(true)}>Esqueceu a senha?</button>
            {/* Botão para realizar o login */}
            <Components.EleButton onClick={() => handleLogin()}>
              Entrar
            </Components.EleButton>
          </>
        )}
      </Components.EstContainer>
      {/* Renderiza o componente de alerta */}
      <Components.EleAlert open={alert} setAlert={alertAction} message={message} />
    </>
  )
}

export default Login // Exporta o componente Login
