import { useAuthActions } from '@convex-dev/auth/react'
import { TriangleAlert } from 'lucide-react'
import React, { useState } from 'react'
import { CgSpinner } from 'react-icons/cg'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import { SignInFlow } from '../types'

type Props = {
  setState: (state: SignInFlow) => void
}

export const SignUpCard = ({ setState }: Props) => {
  const { signIn } = useAuthActions()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  const handleProviderSignIn = (value: 'github' | 'google') => {
    try {
      setPending(true)
      signIn(value)
    } catch (error) {
      console.error(error)
    } finally {
      setPending(false)
    }
  }

  const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
    }

    setPending(true)
    signIn('password', { email, password, flow: 'signUp' })
      .catch((err) => {
        console.log(err)
        setError('Ocorreu um erro.')
      })
      .finally(() => setPending(false))
  }

  return (
    <Card className="h-full w-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Realize cadastro para continuar</CardTitle>
        <CardDescription>
          Use o seu email ou outro serviço para continuar.
        </CardDescription>
      </CardHeader>
      {!!error && (
        <div className="mb-6 flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onPasswordSignUp} className="space-y-2.5">
          <Input
            disabled={pending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            disabled={pending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            type="password"
            required
          />
          <Input
            disabled={pending}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmar senha"
            type="password"
            required
          />
          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? (
              <CgSpinner className="-ml-1 mr-3 h-5 w-5 animate-spin" />
            ) : (
              'Continuar'
            )}
          </Button>
        </form>

        <Separator />

        <div className="flex flex-col gap-y-2.5">
          <Button
            variant="outline"
            size={'lg'}
            className="relative w-full"
            disabled={pending}
            onClick={() => handleProviderSignIn('google')}
          >
            <FcGoogle className="absolute bottom-1/2 left-2.5 top-1/2 size-5 -translate-y-1/2" />
            Continuar com Google
          </Button>
          <Button
            variant="outline"
            size={'lg'}
            className="relative w-full"
            disabled={pending}
            onClick={() => handleProviderSignIn('github')}
          >
            <FaGithub className="absolute bottom-1/2 left-2.5 top-1/2 size-5 -translate-y-1/2" />
            Continuar com GitHub
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Já possui uma conta?{' '}
          <button
            onClick={() => setState('signIn')}
            className="cursor-pointer text-sky-700 hover:underline"
          >
            Entrar
          </button>
        </p>
      </CardContent>
    </Card>
  )
}
