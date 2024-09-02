'use client'

import { useAuthActions } from '@convex-dev/auth/react'
import { Loader, LogOut } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useCurrentUser } from '../api/use-current-user'

export const UserButton = () => {
  const { data, isLoading } = useCurrentUser()
  const { signOut } = useAuthActions()

  if (isLoading)
    return <Loader className="size-4 animate-spin text-muted-foreground" />

  if (!data) return null

  const { name, image } = data

  const avatarFallback = name ? name.charAt(0).toUpperCase() : 'US'

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="relative outline-none">
        <Avatar className="size-10 rounded-md transition hover:opacity-75">
          <AvatarImage src={image} />
          <AvatarFallback className="bg-indigo-500 text-zinc-50">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="right" className="w-60">
        <DropdownMenuItem onClick={signOut} className="h-10">
          <LogOut className="mr-2 size-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
