import { cva, VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { cn } from '@/lib/utils'

import { Id } from '../../../../../convex/_generated/dataModel'

const userItemVariants = cva(
  'flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden',
  {
    variants: {
      variant: {
        default: 'text-secondary/90',
        active: 'text-indigo-600 bg-white/90 hover:bg-white/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type Props = {
  id: Id<'users'>
  label?: string
  image?: string
  variant?: VariantProps<typeof userItemVariants>['variant']
}

export const UserItem = ({ id, image, label = 'Membro', variant }: Props) => {
  const workspaceId = useWorkspaceId()
  const avatarFallback = label.charAt(0).toUpperCase()

  return (
    <Button
      variant="transparent"
      className={cn(userItemVariants({ variant }))}
      size="sm"
      asChild
    >
      <Link href={`/workspaces/${workspaceId}/member/${id}`}>
        <Avatar className="mr-1 size-5 rounded-md">
          <AvatarFallback className="rounded-md bg-indigo-500 text-zinc-50">
            {avatarFallback}
          </AvatarFallback>
          <AvatarImage className="rounded-md" src={image} />
        </Avatar>
        <span className="truncate text-sm">{label}</span>
      </Link>
    </Button>
  )
}
