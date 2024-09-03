'use client'

import { InfoIcon, SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { useGetChannels } from '@/features/channels/api/use-get-channels'
import { useGetMembers } from '@/features/members/api/use-get-members'
import { useGetWorkspaceById } from '@/features/workspaces/api/use-get-workspace-by-id'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

export const Toolbar = () => {
  const workspaceId = useWorkspaceId()
  const router = useRouter()
  const { data } = useGetWorkspaceById({ id: workspaceId })
  const [open, setOpen] = React.useState(false)

  const { data: channels } = useGetChannels({ workspaceId })
  const { data: members } = useGetMembers({ workspaceId })

  function onChannelClick(channelId: string) {
    setOpen(false)

    router.push(`/workspaces/${workspaceId}/channel/${channelId}`)
  }

  function onMemberClick(memberId: string) {
    setOpen(false)

    router.push(`/workspaces/${workspaceId}/member/${memberId}`)
  }

  return (
    <nav className="flex h-10 items-center justify-between bg-indigo-500 p-1.5">
      <div className="flex-1" />
      <div className="min-w-[280px] max-w-[642px] shrink grow-[2]">
        <Button
          className="hover:bg-accent-25 h-7 w-full justify-start bg-accent/25 px-5"
          size="sm"
          onClick={() => setOpen(true)}
        >
          <SearchIcon className="mr-2 size-4 text-white" />
          <span>Procurar {data?.name}</span>
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Pesquise por canais ou membros." />
          <CommandList>
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            <CommandGroup heading="Canais">
              {channels?.map((channel) => (
                <CommandItem
                  key={channel._id}
                  onSelect={() => onChannelClick(channel._id)}
                >
                  {channel.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Membros">
              {members?.map((member) => (
                <CommandItem
                  key={member._id}
                  onSelect={() => onMemberClick(member._id)}
                >
                  {member.user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
      <div className="ml-auto flex flex-1 items-center justify-end">
        <Button variant="transparent" size="iconSm">
          <InfoIcon className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  )
}
