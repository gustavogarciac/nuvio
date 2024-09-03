'use client'

import { FaChevronDown } from 'react-icons/fa'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

type Props = {
  memberName?: string
  memberImage?: string
  onClick?: () => void
}

export const Header = ({
  memberName = 'Membro',
  memberImage,
  onClick,
}: Props) => {
  const avatarFallback = memberName.charAt(0).toUpperCase()

  return (
    <>
      <div className="flex h-[49px] items-center overflow-hidden border-b bg-white px-4">
        <Button
          variant="ghost"
          className="w-auto gap-x-2 overflow-hidden px-2 text-lg font-semibold"
          size="sm"
          onClick={onClick}
        >
          <Avatar className="size-6 rounded-md">
            <AvatarImage src={memberImage} className="rounded-md" />
            <AvatarFallback className="rounded-md bg-indigo-500 text-zinc-50">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <span className="truncate text-sm font-semibold">{memberName}</span>
          <FaChevronDown className="size-2.5" />
        </Button>
      </div>
    </>
  )
}
