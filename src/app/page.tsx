'use client'

import { useEffect, useMemo } from 'react'

import { UserButton } from '@/features/auth/components/user-button'
import { useCreateWorkspaceModal } from '@/features/store/use-create-workspace-modal'
import { useGetWorkSpaces } from '@/features/workspaces/api/use-get-workspaces'

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
