'use client'
import React from 'react'

import { useGetWorkspaceById } from '@/features/workspaces/api/use-get-workspace-by-id'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

const WorkspaceIdPage = () => {
  const workspaceId = useWorkspaceId()
  const { data, isLoading } = useGetWorkspaceById({
    id: workspaceId,
  })

  return <div>{JSON.stringify(data)}</div>
}

export default WorkspaceIdPage
