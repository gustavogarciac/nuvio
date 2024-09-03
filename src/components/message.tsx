import { format, isToday, isYesterday } from 'date-fns'
import dynamic from 'next/dynamic'
import React from 'react'

import { Doc, Id } from '../../convex/_generated/dataModel'
import { Hint } from './hint'
import { Thumbnail } from './thumbnail'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const Renderer = dynamic(() => import('./renderer'), { ssr: false })

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
  threadImage,
  threadTimestamp,
}: MessageProps) => {
  const formatFullTime = (date: Date) => {
    return `${isToday(date) ? 'Hoje' : isYesterday(date) ? 'Ontem' : format(date, 'dd/MM/yyyy')} às ${format(date, 'HH:mm')}`
  }

  if (isCompact) {
    return (
      <div className="group relative flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60">
        <div className="flex items-start gap-2">
          <Hint label={formatFullTime(new Date(createdAt))}>
            <button className="w-[40px] text-center text-xs leading-[22px] text-muted-foreground opacity-0 hover:underline group-hover:opacity-100">
              {format(new Date(createdAt), 'HH:mm')}
            </button>
          </Hint>
          <div className="flex w-full flex-col">
            <Renderer value={body} />

            <Thumbnail url={image} />

            {updatedAt ? (
              <span className="text-xs text-muted-foreground">(editado)</span>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60">
      <div className="flex items-start gap-2">
        <button>
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
        <div className="flex w-full flex-col overflow-hidden">
          <div className="text-sm">
            <button
              onClick={() => {}}
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
        </div>
      </div>
    </div>
  )
}
