import { AlertTriangle, Loader, MailIcon, XIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { Id } from '../../../../convex/_generated/dataModel'
import { useGetMember } from '../api/use-get-member'

type Props = {
  memberId: Id<'members'>
  onClose: () => void
}

export const Profile = ({ memberId, onClose }: Props) => {
  const { data: member, isLoading: isLoadingMember } = useGetMember({
    memberId,
  })

  const fallback = member?.user?.name?.charAt(0).toUpperCase() ?? 'M'

  if (isLoadingMember) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex h-[49px] items-center justify-between border-b px-4">
          <p className="text-lg font-bold">Perfil</p>
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

  if (!member) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex h-[49px] items-center justify-between border-b px-4">
          <p className="text-lg font-bold">Perfil</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex h-full flex-col items-center justify-center gap-2">
          <AlertTriangle className="size-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Perfil não encontrado!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[49px] items-center justify-between border-b px-4">
        <p className="text-lg font-bold">Perfil</p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center p-4">
        <Avatar className="size-full max-h-[230px] max-w-[230px] rounded-md">
          <AvatarImage
            className="rounded-md object-cover"
            src={member.user.image}
          />
          <AvatarFallback className="aspect-square rounded-md bg-indigo-500 text-4xl text-white">
            {fallback}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col p-4">
        <p className="text-xl font-bold">{member.user.name}</p>
      </div>

      <Separator />

      <div className="flex flex-col p-4">
        <p className="mb-4 text-sm font-bold">Informações de contato</p>
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-md bg-muted">
            <MailIcon className="size-4 text-muted-foreground" />
          </div>

          <div className="flex flex-col">
            <p className="text-base font-semibold text-muted-foreground">
              Endereço de email
            </p>
            <Link
              href={`mailto:${member.user.email}`}
              className="text-sm text-indigo-500 hover:underline"
            >
              {member.user.email}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
