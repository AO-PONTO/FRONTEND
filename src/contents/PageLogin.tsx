import React from 'react'
import * as Components from '@/components'
import api from '@/service/api'
import { Logo1 } from '@/assets'
import Image from 'next/image'

interface propsLogin {
  setLogged: React.Dispatch<React.SetStateAction<boolean>>
  setLogin: React.Dispatch<React.SetStateAction<number>>,
  pass: string
}

const Login = (props:propsLogin) => {
  const [login, setLogin] = React.useState<string>('')
  const [pass, setPass] = React.useState<string>('')
  const [alert, setAlert] = React.useState<boolean>(false)
  const [message, setMessage] = React.useState<string>('')
  const [newPass, setNewPass] = React.useState<boolean>(false)
  const [step, setStep] = React.useState<string>('1')
  const [email, setEmail] = React.useState<string>('')
  const [token, setToken] = React.useState<string>('')
  const [code, setCode] = React.useState<string>('')
  const [newPassword, setNewPassword] = React.useState<string>('')

  const handleLogin = async () => {
    if(login.length === 0 || pass.length === 0) {
      setMessage('Insira as informações de login')
      setAlert(true)
    } else {
      try {
        const response = await api.post('/login/access-token',{ username: login.replace(/[.-]/g,''), password: pass })
        if (response) {
          localStorage.setItem(
            '@aplication/aoponto',
            JSON.stringify(response.data)
          )
          props.setLogin(response.data.user.access_level)
          props.setLogged(true)
        }
      } catch (error:any) {
        console.log(error)
        setMessage(error.response.data.detail)
        setAlert(true)
      }
    } 
  }
  
  const getLogin = (value: string, label: string) => {
    let valor = value.replace(/\D/g, '')
    valor = valor.substring(0, 11)

    valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    
    setLogin(valor)
  }
  const getPass = (value: string, name: string) => {
    setPass(value)
  }
  const getEmail = (value: string, name: string) => {
    setEmail(value)
  }
  const getCode = (value: string, name: string) => {
    setCode(value)
  }
  const getNewPassword = (value: string, name: string) => {
    setNewPassword(value)
  }

  const alertAction = () => {
    setAlert(false)
  }

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

  const codeStep = async () => {
    try {
      await api.post('/forgot-my-password/code', { params: { code, Authentication: token }})
    } catch (erro) {
      console.log(erro)
      setMessage('Erro Interno no servidor')
      setAlert(true)
    } finally {
      setStep('3')
    }
  }

  const newPasswordStep = async () => {
    try {
      await api.post('/new-password', { password: newPassword } , { params: { Authentication: token }})
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
      <Components.EstContainer size='small' shadow='center' rounded='medium'>
        {newPass ? (
          <>
            <div className='flex flex-col w-full p-2 gap-2s'>
            {step === '1' ? (
                <>
                  <h1 className="text-center text-2xl font-medium pb-4">Informe seu Email</h1>
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
            <div className="flex justify-between gap-2 w-full">
              <Components.EleButton onClick={() => setNewPass(false)}>
                Voltar
              </Components.EleButton>
              <Components.EleButton onClick={() => {
                if(step === '1') {
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
              <Image 
                src={Logo1}
                alt='Logo'
                height={500}
                width={500}
                className='w-full h-fit'
              />
              <Components.EleInput 
                type='text' 
                label='Usuario'
                name='login'
                value={login}
                onChange={getLogin}
              />
              <Components.EleInput 
                type='password' 
                label='Senha'
                name='senha'
                value={pass}
                onChange={getPass}
              />
            </div>
            <button className='px-4 text-sm' onClick={() => setNewPass(true)}>Esqueceu a senha?</button>
            <Components.EleButton onClick={() => handleLogin()}>
              Entrar
            </Components.EleButton>
          </>
        )}
      </Components.EstContainer>
      <Components.EleAlert open={alert} setAlert={alertAction} message={message} />
    </>
  )
}

export default Login