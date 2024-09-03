'use client'

import { Loader, TriangleAlert } from 'lucide-react'
import React from 'react'

import { MessageList } from '@/components/message-list'
import { useGetChannel } from '@/features/channels/api/use-get-channel'
import { useGetMessages } from '@/features/messages/api/use-get-messages'
import { useChannelId } from '@/hooks/use-channel-id'

import { ChatInput } from './_components/chat-input'
import { Header } from './_components/header'

const ChannelIdPage = () => {
  const channelId = useChannelId()

  const { data: channel, isLoading: channelLoading } = useGetChannel({
    channelId,
  })

  const { results, status, loadMore } = useGetMessages({ channelId })

  if (channelLoading || status === 'LoadingFirstPage') {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!channel) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-y-2">
        <TriangleAlert className="size-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Canal não encontrado
        </span>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <Header channelName={channel.name} />
      <MessageList
        channelName={channel.name}
        channelCreationTime={channel._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === 'LoadingMore'}
        canLoadMore={status === 'CanLoadMore'}
      />
      <ChatInput placeholder={`Envie uma mensagem em # ${channel.name}`} />
    </div>
  )
}

export default ChannelIdPage
