'use client'

import { AlertTriangle, Loader } from 'lucide-react'
import React from 'react'

import { useCurrentMember } from '@/features/members/api/use-current-member'
import { useGetWorkspaceById } from '@/features/workspaces/api/use-get-workspace-by-id'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

import { WorkspaceHeader } from './workspace-header'

export const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId()

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  })
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspaceById({
    id: workspaceId,
  })

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
    </div>
  )
}
