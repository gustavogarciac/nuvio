'use client'

import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizontal,
} from 'lucide-react'
import React from 'react'

import { useGetChannels } from '@/features/channels/api/use-get-channels'
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal'
import { useCurrentMember } from '@/features/members/api/use-current-member'
import { useGetMembers } from '@/features/members/api/use-get-members'
import { useGetWorkspaceById } from '@/features/workspaces/api/use-get-workspace-by-id'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

import { SidebarItem } from './sidebar-item'
import { UserItem } from './user-item'
import { WorkspaceHeader } from './workspace-header'
import { WorkspaceSection } from './workspace-section'
import { useChannelId } from '@/hooks/use-channel-id'

export const WorkspaceSidebar = () => {
  const channelId = useChannelId()
  const workspaceId = useWorkspaceId()

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  })
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspaceById({
    id: workspaceId,
  })
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  })
  const { data: members, isLoading: membersLoading } = useGetMembers({
    workspaceId,
  })
  /* TODO: Loading States */

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_open, setOpen] = useCreateChannelModal()

  if (workspaceLoading || memberLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-indigo-400">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    )
  }

  if (!workspace || !member) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-y-2 bg-indigo-400">
        <AlertTriangle className="size-5 text-white" />
        <p className="text-sm font-semibold text-white">
          Área de trabalho não encontrada
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-indigo-400">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === 'admin'}
      />
      <div className="mt-3 flex flex-col px-2">
        <SidebarItem label="Tópicos" icon={MessageSquareText} id="threads" />
        <SidebarItem
          label="Enviados e Rascunhos"
          icon={SendHorizontal}
          id="drafts"
        />
      </div>
      <WorkspaceSection
        label="Canais"
        hint="Novo canal"
        onNew={member.role === 'admin' ? () => setOpen(true) : undefined}
      >
        {channels?.map((item) => (
          <SidebarItem
            key={item._id}
            icon={HashIcon}
            label={item.name}
            id={item._id}
            variant={channelId === item._id ? 'active' : 'default'}
          />
        ))}
      </WorkspaceSection>
      <WorkspaceSection
        label="Mensagens diretas"
        hint="Adicionar membro"
        onNew={() => {}}
      >
        {members?.map((item) => (
          <UserItem
            key={item._id}
            id={item.user._id}
            image={item.user.image}
            label={item.user.name}
          />
        ))}
      </WorkspaceSection>
    </div>
  )
}
