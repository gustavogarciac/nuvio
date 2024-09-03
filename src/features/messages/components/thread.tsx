import {
  differenceInMinutes,
  format,
  isSameWeek,
  isToday,
  isYesterday,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AlertTriangle, Loader, XIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import Quill from 'quill'
import React, { useRef, useState } from 'react'

import { Message } from '@/components/message'
import { Button } from '@/components/ui/button'
import { useCurrentMember } from '@/features/members/api/use-current-member'
import { useGenerateUploadUrl } from '@/features/upload/api/use-generate-upload-url'
import { useChannelId } from '@/hooks/use-channel-id'
import { useToast } from '@/hooks/use-toast'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

import { Id } from '../../../../convex/_generated/dataModel'
import { useCreateMessage } from '../api/use-create-message'
import { useGetMessage } from '../api/use-get-message'
import { useGetMessages } from '../api/use-get-messages'

const Editor = dynamic(() => import('@/components/editor'), { ssr: false })

const TIME_THRESHOLD = 5

interface ThreadProps {
  messageId: Id<'messages'>
  onClose: () => void
}

type CreateMessageValues = {
  channelId: Id<'channels'>
  workspaceId: Id<'workspaces'>
  parentMessageId: Id<'messages'>
  conversationId?: Id<'conversations'>
  body: string
  image?: Id<'_storage'>
}

export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const workspaceId = useWorkspaceId()
  const channelId = useChannelId()

  const [editingId, setEditingId] = useState<Id<'messages'> | null>(null)
  const [editorKey, setEditorKey] = useState(0)
  const [isPending, setIsPending] = useState(false)

  const editorRef = useRef<Quill | null>(null)

  const { mutate: createMessage } = useCreateMessage()
  const { mutate: generateUpload } = useGenerateUploadUrl()

  const { toast } = useToast()

  const { data: currentMember } = useCurrentMember({ workspaceId })
  const { data: message, isLoading: isMessageLoading } = useGetMessage({
    messageId,
  })
  const { results, status, loadMore } = useGetMessages({
    channelId,
    parentMessageId: messageId,
  })

  const canLoadMore = status === 'CanLoadMore'
  const isLoadingMore = status === 'LoadingMore'

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string
    image: File | null | undefined
  }) => {
    try {
      setIsPending(true)
      editorRef?.current?.enable(false)

      const values: CreateMessageValues = {
        channelId,
        workspaceId,
        parentMessageId: messageId,
        conversationId: message?.conversationId,
        body,
        image: undefined,
      }

      if (image) {
        const url = await generateUpload({}, { throwError: true })

        if (!url) {
          throw new Error('Failed to generate upload URL')
        }

        const result = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': image.type },
          body: image,
        })

        if (!result.ok) {
          throw new Error('Failed to upload image')
        }

        const { storageId } = await result.json()

        values.image = storageId
      }

      await createMessage(values, { throwError: true })

      setEditorKey((prevKey) => prevKey + 1)
    } catch (error) {
      toast({
        title: 'Erro ao enviar a mensagem',
        description: 'Por favor, tente novamente.',
      })
    } finally {
      setIsPending(false)
      editorRef?.current?.enable(true)
    }
  }

  const groupedMessages = results?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime)
      const dateKey = format(date, 'yyyy-MM-dd', { locale: ptBR })

      if (!groups[dateKey]) {
        groups[dateKey] = []
      }

      groups[dateKey].unshift(message)
      return groups
    },
    {} as Record<string, typeof results>,
  )

  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr)

    if (isToday(date)) return 'Hoje'
    if (isYesterday(date)) return 'Ontem'
    if (!isToday(date) && !isYesterday(date) && isSameWeek(date, new Date())) {
      return format(date, 'EEEE', { locale: ptBR })
    }

    return format(date, "dd 'de' MMMM (EEEE)", { locale: ptBR })
  }

  if (isMessageLoading || status === 'LoadingFirstPage') {
    return (
      <div className="flex h-full flex-col">
        <div className="flex h-[49px] items-center justify-between border-b px-4">
          <p className="text-lg font-bold">Tópico</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex h-full items-center justify-center">
          <Loader className="size-4 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (!message) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex h-[49px] items-center justify-between border-b px-4">
          <p className="text-lg font-bold">Tópico</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex h-full flex-col items-center justify-center gap-2">
          <AlertTriangle className="size-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Esta mensagem não foi encontrada!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[49px] items-center justify-between border-b px-4">
        <p className="text-lg font-bold">Tópico</p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
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
                  hideThreadButton
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

        <Message
          hideThreadButton
          memberId={message.memberId}
          authorImage={message.user.image}
          authorName={message.user.name}
          isAuthor={message.memberId === currentMember?._id}
          body={message.body}
          image={message.image}
          createdAt={message._creationTime}
          updatedAt={message.updatedAt}
          id={message._id}
          reactions={message.reactions}
          isEditing={editingId === message._id}
          setEditingId={setEditingId}
          threadName={message.threadName}
        />
      </div>
      <div className="px-4">
        <Editor
          key={editorKey}
          disabled={isPending}
          innerRef={editorRef}
          onSubmit={handleSubmit}
          placeholder="Escreva uma resposta..."
        />
      </div>
    </div>
  )
}