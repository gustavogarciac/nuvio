'use client'
import React from 'react'

import { useWorkspaceId } from '@/hooks/use-workspace-id'

const WorkspaceIdPage = () => {
  const workspaceId = useWorkspaceId()

  return <div>Workspace Id Page {workspaceId}</div>
}

export default WorkspaceIdPage
