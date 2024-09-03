import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronRightIcon } from 'lucide-react'
import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

type Props = {
  count?: number
  image?: string
  timestamp?: number
  name?: string
  onClick?: () => void
}

export const ThreadBar = ({
  count,
  image,
  timestamp,
  onClick,
  name = 'Membro',
}: Props) => {
  if (!count || !timestamp) return null
  const avatarFallback = name.charAt(0).toUpperCase()

  return (
    <button
      className="group/thread-bar flex max-w-[600px] items-center justify-start rounded-md border border-transparent p-1 transition hover:border-border hover:bg-white"
      onClick={onClick}
    >
      <div className="flex items-center gap-x-2 overflow-hidden">
        <Avatar className="size-6 shrink-0">
          <AvatarImage className="rounded-md object-cover" src={image} />
          <AvatarFallback className="rounded-md bg-indigo-500 text-xs text-white">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span className="truncate text-xs font-bold text-indigo-700 hover:underline">
          {count} {count === 1 ? 'resposta' : 'respostas'}
        </span>
        <span className="block truncate text-xs text-muted-foreground group-hover/thread-bar:hidden">
          Ultima resposta{' '}
          {formatDistanceToNow(timestamp, { addSuffix: true, locale: ptBR })}
        </span>
        <span className="hidden truncate text-xs text-muted-foreground group-hover/thread-bar:block">
          Visualizar tópico
        </span>
      </div>
      <ChevronRightIcon className="ml-auto size-4 shrink-0 text-muted-foreground opacity-0 transition group-hover/thread-bar:opacity-100" />
    </button>
  )
}
