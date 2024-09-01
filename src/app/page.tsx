'use client'

import { useEffect, useMemo } from 'react'

import { UserButton } from '@/features/auth/components/user-button'
import { useGetWorkSpaces } from '@/features/workspaces/api/use-get-workspaces'
import { useCreateWorkspaceModal } from '@/features/workspaces/store/use-create-workspace-modal'

export default function Home() {
  const [open, setOpen] = useCreateWorkspaceModal()
  const { data, isLoading } = useGetWorkSpaces()

  const workspaceId = useMemo(() => data?.[0]?._id, [data])

  useEffect(() => {
    if (isLoading) return

    if (workspaceId) {
      console.log('Redirect to workspace')
    } else if (!open) {
      setOpen(true)
    }
  }, [workspaceId, isLoading, open, setOpen])

  return (
    <main>
      <UserButton />
    </main>
  )
}
