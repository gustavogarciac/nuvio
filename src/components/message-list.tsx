import {
  differenceInMinutes,
  format,
  isSameWeek,
  isToday,
  isYesterday,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Info, Loader } from 'lucide-react'
import React from 'react'

import { useCurrentMember } from '@/features/members/api/use-current-member'
import { GetMessagesReturnType } from '@/features/messages/api/use-get-messages'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

import { Id } from '../../convex/_generated/dataModel'
import { ChannelHero } from './channel-hero'
import { Message } from './message'

const TIME_THRESHOLD = 5

type MessageListProps = {
  memberName?: string
  memberImage?: string
  channelName?: string
  channelCreationTime?: number
  variant?: 'channel' | 'thread' | 'conversation'
  data: GetMessagesReturnType
  loadMore: () => void
  isLoadingMore: boolean
  canLoadMore: boolean
}

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr)

  if (isToday(date)) return 'Hoje'
  if (isYesterday(date)) return 'Ontem'
  if (!isToday(date) && !isYesterday(date) && isSameWeek(date, new Date())) {
    return format(date, 'EEEE', { locale: ptBR })
  }

  return format(date, "dd 'de' MMMM (EEEE)", { locale: ptBR })
}

export const MessageList = ({
  canLoadMore,
  data,
  isLoadingMore,
  loadMore,
  variant = 'channel',
  channelName,
  channelCreationTime,
  memberName,
  memberImage,
}: MessageListProps) => {
  const [editingId, setEditingId] = React.useState<Id<'messages'> | null>(null)
  const workspaceId = useWorkspaceId()
  const { data: currentMember } = useCurrentMember({ workspaceId })

  const groupedMessages = data?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime)
      const dateKey = format(date, 'yyyy-MM-dd')

      if (!groups[dateKey]) {
        groups[dateKey] = []
      }

      groups[dateKey].unshift(message)
      return groups
    },
    {} as Record<string, typeof data>,
  )

  return (
    <div className="messages-scrollbar flex flex-1 flex-col-reverse overflow-y-auto pb-4">
      {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
        <div key={dateKey}>
          <div className="relative my-2 text-center">
            <hr className="absolute left-0 right-0 top-1/2 border-t border-gray-200" />
            <span className="relative inline-block rounded-full border border-gray-300 bg-white px-4 py-1 text-xs shadow-sm">
              {formatDateLabel(dateKey)}
            </span>
          </div>
          {messages.map((message, index) => {
            const prevMessage = messages[index - 1]
            const isCompact =
              prevMessage &&
              prevMessage.user?._id === message.user?._id &&
              differenceInMinutes(
                new Date(message._creationTime),
                new Date(prevMessage._creationTime),
              ) < TIME_THRESHOLD

            return (
              <Message
                key={message._id}
                id={message._id}
                memberId={message.memberId}
                authorImage={message.user.image}
                authorName={message.user.name}
                isAuthor={message.memberId === currentMember?._id}
                reactions={message.reactions}
                body={message.body}
                image={message.image}
                updatedAt={message.updatedAt}
                createdAt={message._creationTime}
                isEditing={editingId === message._id}
                setEditingId={setEditingId}
                isCompact={isCompact}
                hideThreadButton={variant === 'thread'}
                threadCount={message.threadCount}
                threadImage={message.threadImage}
                threadTimestamp={message.threadTimestamp}
              />
            )
          })}
        </div>
      ))}
      <div
        className="h-1"
        ref={(el) => {
          if (el) {
            const observer = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting && canLoadMore) {
                  loadMore()
                }
              },
              { threshold: 1.0 },
            )

            observer.observe(el)
            return () => observer.disconnect()
          }
        }}
      />
      {isLoadingMore && (
        <div className="relative my-2 text-center">
          <hr className="absolute left-0 right-0 top-1/2 border-t border-gray-200" />
          <span className="relative inline-block rounded-full border border-gray-300 bg-white px-4 py-1 text-xs shadow-sm">
            <Loader className="size-4 animate-spin" />
          </span>
        </div>
      )}
      {variant === 'channel' && channelName && channelCreationTime && (
        <ChannelHero name={channelName} creationTime={channelCreationTime} />
      )}
    </div>
  )
}
