import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

type Props = {
  name?: string
  image?: string
}

export const ConversationHero = ({ name = 'Membro', image }: Props) => {
  const avatarFallback = name.charAt(0).toUpperCase()

  return (
    <div className="mx-5 mb-4 mt-[88px]">
      <div className="mb-2 flex items-center gap-x-1">
        <Avatar className="mr-2 size-14 rounded-md">
          <AvatarImage src={image} className="rounded-md" />
          <AvatarFallback className="rounded-md bg-indigo-500 text-zinc-50">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <p className="text-2xl font-bold">{name}</p>
      </div>
      <p className="mb-4 font-normal text-slate-800">
        Esta conversa é privada entre você e <strong>{name}.</strong>
      </p>
    </div>
  )
}
