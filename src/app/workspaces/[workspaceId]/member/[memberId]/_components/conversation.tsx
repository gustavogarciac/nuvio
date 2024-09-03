import { Loader } from 'lucide-react'
import React from 'react'

import { MessageList } from '@/components/message-list'
import { useGetMember } from '@/features/members/api/use-get-member'
import { useGetMessages } from '@/features/messages/api/use-get-messages'
import { useMemberId } from '@/hooks/use-member-id'
import { usePanel } from '@/hooks/use-panel'

import { Id } from '../../../../../../../convex/_generated/dataModel'
import { ChatInput } from './chat-input'
import { Header } from './header'

type Props = {
  id: Id<'conversations'>
}

export const Conversation = ({ id }: Props) => {
  const memberId = useMemberId()

  const { onOpenProfile } = usePanel()

  const { data: member, isLoading: memberLoading } = useGetMember({
    memberId,
  })

  const { results, status, loadMore } = useGetMessages({
    conversationId: id,
  })

  if (memberLoading || status === 'LoadingFirstPage') {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <Header
        memberName={member?.user?.name}
        memberImage={member?.user?.image}
        onClick={() => onOpenProfile(memberId)}
      />

      <MessageList
        data={results}
        variant="conversation"
        memberImage={member?.user?.image}
        memberName={member?.user?.name}
        loadMore={loadMore}
        isLoadingMore={status === 'LoadingMore'}
        canLoadMore={status === 'CanLoadMore'}
      />

      <ChatInput
        placeholder={`Escreva uma mensagem para ${member?.user?.name}`}
        conversationId={id}
      />
    </div>
  )
}
