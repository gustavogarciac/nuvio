'use client'

import { useGetChannel } from '@/features/channels/api/use-get-channel'
import { useChannelId } from '@/hooks/use-channel-id'
import { Loader, TriangleAlert } from 'lucide-react'
import React from 'react'
import { Header } from './_components/header'

const ChannelIdPage = () => {
  const channelId = useChannelId()

  const { data: channel, isLoading: channelLoading } = useGetChannel({ channelId })

  if (channelLoading) {
    return (
      <div className='h-full flex-1 items-center justify-center flex'>
        <Loader className="animate-spin size-5 text-muted-foreground" />
      </div>
    )
  }

  if (!channel) {
    return (
      <div className='h-full flex-1 flex-col gap-y-2 items-center justify-center flex'>
        <TriangleAlert className="size-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Canal não encontrado</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <Header channelName={channel.name} />
    </div>
  )
}

export default ChannelIdPage