'use client'
import { useGetChannels } from '@/features/channels/api/use-get-channels'
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal'
import { useGetWorkspaceById } from '@/features/workspaces/api/use-get-workspace-by-id'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { Loader, TriangleAlertIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo } from 'react'

const WorkspaceIdPage = () => {
  const workspaceId = useWorkspaceId()
  const router = useRouter()
  const [open, setOpen] = useCreateChannelModal()

  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspaceById({ id: workspaceId })
  const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId })

  const channelId = useMemo(() => channels?.[0]?._id, [channels])

  useEffect(() => {
    if(workspaceLoading || channelsLoading || !workspace) return

    if (channelId) {
      router.push(`/workspaces/${workspaceId}/channel/${channelId}`)
    } else if (!open) {
      setOpen(true)
    }

  }, [channelId, workspaceLoading, channelsLoading, workspace, open, setOpen, router, workspaceId])

  if(workspaceLoading || channelsLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if(!workspace) {
    return (
        <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
          <TriangleAlertIcon className="size-6 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Área de trabalho não encontrada.</span>
        </div>
    )
  }

  return <div></div>
}

export default WorkspaceIdPage
