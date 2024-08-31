import React, { useState } from 'react'
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

export const SignInCard = ({ setState }: Props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <Card className="h-full w-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Entre para continuar</CardTitle>
        <CardDescription>
          Use o seu email ou outro serviço para continuar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5">
          <Input
            disabled={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            disabled={false}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            type="password"
            required
          />
          <Button type="submit" size="lg" className="w-full" disabled={false}>
            Continuar
          </Button>
        </form>

        <Separator />

        <div className="flex flex-col gap-y-2.5">
          <Button
            variant="outline"
            size={'lg'}
            className="relative w-full"
            disabled={false}
            onClick={() => {}}
          >
            <FcGoogle className="absolute bottom-1/2 left-2.5 top-1/2 size-5 -translate-y-1/2" />
            Continuar com Google
          </Button>
          <Button
            variant="outline"
            size={'lg'}
            className="relative w-full"
            disabled={false}
            onClick={() => {}}
          >
            <FaGithub className="absolute bottom-1/2 left-2.5 top-1/2 size-5 -translate-y-1/2" />
            Continuar com GitHub
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Não possui uma conta?{' '}
          <button
            onClick={() => setState('signUp')}
            className="cursor-pointer text-sky-700 hover:underline"
          >
            Realizar cadastro
          </button>
        </p>
      </CardContent>
    </Card>
  )
}
