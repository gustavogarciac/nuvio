'use client'

import { Loader } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo } from 'react'
import VerificationInput from 'react-verification-input'

import { Button } from '@/components/ui/button'
import { useGetWorkspaceInfo } from '@/features/workspaces/api/use-get-workspace-info'
import { useJoinWorkspace } from '@/features/workspaces/api/use-join-workspace'
import { toast } from '@/hooks/use-toast'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { cn } from '@/lib/utils'

const JoinWorkspaceIdPage = () => {
  const { replace } = useRouter()
  const workspaceId = useWorkspaceId()

  const { mutate, isPending } = useJoinWorkspace()
  const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId })

  const isMember = useMemo(() => data?.isMember, [data?.isMember])

  useEffect(() => {
    if (isMember) {
      replace(`/workspaces/${workspaceId}`)
    }
  }, [isMember, replace, workspaceId])

  function handleComplete(value: string) {
    mutate(
      { workspaceId, joinCode: value },
      {
        onSuccess: () => {
          replace(`/workspaces/${workspaceId}`)
          toast({
            title: 'Bem vindo!',
            description: 'Você agora faz parte desta área de trabalho.',
          })
        },
        onError: () => {
          toast({
            title: 'Erro',
            description: 'Acesso inválido.',
            variant: 'destructive',
          })
        },
      },
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-y-8 rounded-lg bg-white p-8 shadow-md">
      <Image src={'/assets/logo.png'} width={60} height={60} alt="Logo" />
      <div className="flex max-w-md flex-col items-center justify-center gap-y-4">
        <div className="flex flex-col items-center justify-center gap-y-2">
          <h1 className="text-2xl font-bold">Fazer parte de {data?.name}</h1>
          <p className="text-md text-muted-foreground">
            Insira o código de acesso para fazer parte desta área de trabalho.
          </p>
        </div>

        <VerificationInput
          onComplete={handleComplete}
          classNames={{
            container: cn(
              'flex gap-x-2',
              isPending && 'opacity-50 pointer-events-none cursor-not-allowed',
            ),
            character:
              'uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500',
            characterInactive: 'bg-muted',
            characterSelected: 'bg-white text-black',
            characterFilled: 'bg-white text-black',
          }}
          autoFocus
          length={6}
        />
      </div>
      <div className="flex gap-x-4">
        <Button size="lg" variant="outline" asChild>
          <Link href="/">Voltar para a página inicial</Link>
        </Button>
      </div>
    </div>
  )
}

export default JoinWorkspaceIdPage
