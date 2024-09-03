'use client'

import { AlertTriangle, Loader } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { useCreateOrGetConversation } from '@/features/conversation/api/use-create-or-get-conversation'
import { useMemberId } from '@/hooks/use-member-id'
import { useToast } from '@/hooks/use-toast'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

import { Id } from '../../../../../../convex/_generated/dataModel'
import { Conversation } from './_components/conversation'

const MemberIdPage = () => {
  const workspaceId = useWorkspaceId()
  const memberId = useMemberId()

  const { toast } = useToast()

  const [conversationId, setConversationId] =
    useState<Id<'conversations'> | null>(null)

  const { mutate, isPending } = useCreateOrGetConversation()

  useEffect(() => {
    mutate(
      { workspaceId, memberId },
      {
        onSuccess({ conversationId }) {
          setConversationId(conversationId)
        },
        onError(error) {
          console.log(error)
          setConversationId(null)
          toast({
            title: 'Ocorreu um erro!',
            description: 'Não foi possível carregar a conversa',
          })
        },
      },
    )
  }, [workspaceId, memberId, mutate, toast])

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    )
  }
  if (!conversationId) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <AlertTriangle className="size-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Conversa não encontrada
        </span>
      </div>
    )
  }

  return <Conversation id={conversationId} />
}

export default MemberIdPage
