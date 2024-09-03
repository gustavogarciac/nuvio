import { format, isToday, isYesterday } from 'date-fns'
import dynamic from 'next/dynamic'
import React from 'react'

import { useRemoveMessage } from '@/features/messages/api/use-remove-message'
import { useUpdateMessage } from '@/features/messages/api/use-update-message'
import { useToggleReaction } from '@/features/reactions/api/use-toggle-reaction'
import { useConfirm } from '@/hooks/use-confirm'
import { usePanel } from '@/hooks/use-panel'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

import { Doc, Id } from '../../convex/_generated/dataModel'
import { Hint } from './hint'
import { Reactions } from './reactions'
import { ThreadBar } from './thread-bar'
import { Thumbnail } from './thumbnail'
import { Toolbar } from './toolbar'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const Renderer = dynamic(() => import('./renderer'), { ssr: false })
const Editor = dynamic(() => import('./editor'), { ssr: false })

interface MessageProps {
  id: Id<'messages'>
  memberId: Id<'members'>
  authorImage?: string
  authorName?: string
  isAuthor: boolean
  reactions: Array<
    Omit<Doc<'reactions'>, 'memberId'> & {
      count: number
      memberIds: Id<'members'>[]
    }
  >
  body: Doc<'messages'>['body']
  image: string | null | undefined
  createdAt: Doc<'messages'>['_creationTime']
  updatedAt: Doc<'messages'>['updatedAt']
  isEditing: boolean
  isCompact?: boolean
  setEditingId: (id: Id<'messages'> | null) => void
  hideThreadButton?: boolean
  threadCount?: number
  threadImage?: string
  threadName?: string
  threadTimestamp?: number
}

export const Message = ({
  id,
  memberId,
  authorImage,
  authorName,
  isAuthor,
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  isCompact,
  setEditingId,
  hideThreadButton,
  threadCount,
  threadName,
  threadImage,
  threadTimestamp,
}: MessageProps) => {
  const { onOpenMessage, parentMessageId, onCloseMessage, onOpenProfile } =
    usePanel()

  const formatFullTime = (date: Date) => {
    return `${isToday(date) ? 'Hoje' : isYesterday(date) ? 'Ontem' : format(date, 'dd/MM/yyyy')} às ${format(date, 'HH:mm')}`
  }
  const { toast } = useToast()

  const [ConfirmDialog, confirm] = useConfirm({
    title: 'Deletar mensagem',
    message: 'Você tem certeza que deseja deletar esta mensagem?',
  })

  const { mutate: updateMessage, isPending: isUpdatingMessage } =
    useUpdateMessage()
  const { mutate: removeMessage, isPending: isRemovingMessage } =
    useRemoveMessage()
  const { mutate: toggleReaction, isPending: isTogglingReaction } =
    useToggleReaction()

  const isPending = isUpdatingMessage || isRemovingMessage || isTogglingReaction

  const handleReaction = (value: string) => {
    toggleReaction(
      { messageId: id, value },
      {
        onError: () => {
          toast({
            title: 'Erro ao reagir à mensagem.',
          })
        },
      },
    )
  }

  const handleUpdate = ({ body }: { body: string }) => {
    updateMessage(
      { body, id },
      {
        onSuccess: () => {
          toast({
            title: 'Mensagem atualizada com sucesso.',
          })
          setEditingId(null)
        },
        onError: () => {
          toast({
            title: 'Erro ao atualizar mensagem.',
          })
        },
      },
    )
  }

  const handleDelete = async () => {
    const ok = await confirm()

    if (!ok) return

    removeMessage(
      {
        id,
      },
      {
        onSuccess: ({ messageId }) => {
          toast({
            title: 'Mensagem deletada',
          })

          if (parentMessageId === messageId) {
            onCloseMessage()
          }
        },
        onError: () => {
          toast({
            title: 'Erro ao deletar mensagem.',
          })
        },
      },
    )
  }

  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            'group relative flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60',
            isEditing && 'bg-indigo-100 hover:bg-indigo-100',
            isRemovingMessage &&
              'origin-bottom scale-y-0 transform bg-rose-500/50 transition-all duration-500',
          )}
        >
          <div className="flex items-start gap-2">
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className="w-[40px] text-center text-xs leading-[22px] text-muted-foreground opacity-0 hover:underline group-hover:opacity-100">
                {format(new Date(createdAt), 'HH:mm')}
              </button>
            </Hint>
            {isEditing ? (
              <div className="h-full w-full">
                <Editor
                  onSubmit={handleUpdate}
                  disabled={isUpdatingMessage}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                  variant="update"
                />
              </div>
            ) : (
              <div className="flex w-full flex-col">
                <Renderer value={body} />

                <Thumbnail url={image} />

                {updatedAt ? (
                  <span className="text-xs text-muted-foreground">
                    (editado)
                  </span>
                ) : null}
                <Reactions data={reactions} onChange={handleReaction} />
                <ThreadBar
                  count={threadCount}
                  image={threadImage}
                  name={threadName}
                  timestamp={threadTimestamp}
                  onClick={() => onOpenMessage(id)}
                />
              </div>
            )}
          </div>

          {!isEditing && (
            <Toolbar
              isAuthor={isAuthor}
              isPending={isPending}
              handleEdit={() => setEditingId(id)}
              handleThread={() => onOpenMessage(id)}
              handleDelete={handleDelete}
              handleReaction={handleReaction}
              hideThreadButton={hideThreadButton}
            />
          )}
        </div>
      </>
    )
  }

  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          'group relative flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60',
          isEditing && 'bg-indigo-100 hover:bg-indigo-100',
          isRemovingMessage &&
            'origin-bottom scale-y-0 transform bg-rose-500/50 transition-all duration-500',
        )}
      >
        <div className="flex items-start gap-2">
          <button onClick={() => onOpenProfile(memberId)}>
            <Avatar className="rounded-md">
              <AvatarImage
                className="rounded-md object-cover"
                src={authorImage}
              />
              <AvatarFallback className="rounded-md bg-indigo-500 text-xs text-white">
                {authorName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>
          {isEditing ? (
            <div className="h-full w-full">
              <Editor
                onSubmit={handleUpdate}
                disabled={isUpdatingMessage}
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
                variant="update"
              />
            </div>
          ) : (
            <div className="flex w-full flex-col overflow-hidden">
              <div className="text-sm">
                <button
                  onClick={() => onOpenProfile(memberId)}
                  className="font-bold text-primary hover:underline"
                >
                  {authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                <Hint label={formatFullTime(new Date(createdAt))}>
                  <button className="text-xs text-muted-foreground hover:underline">
                    {format(new Date(createdAt), 'HH:mm')}
                  </button>
                </Hint>
              </div>
              <Renderer value={body} />

              <Thumbnail url={image} />

              {updatedAt ? (
                <span className="text-xs text-muted-foreground">(editado)</span>
              ) : null}
              <Reactions data={reactions} onChange={handleReaction} />
              <ThreadBar
                count={threadCount}
                image={threadImage}
                name={threadName}
                timestamp={threadTimestamp}
                onClick={() => onOpenMessage(id)}
              />
            </div>
          )}
        </div>

        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={false}
            handleEdit={() => setEditingId(id)}
            handleThread={() => onOpenMessage(id)}
            handleDelete={handleDelete}
            handleReaction={handleReaction}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    </>
  )
}
