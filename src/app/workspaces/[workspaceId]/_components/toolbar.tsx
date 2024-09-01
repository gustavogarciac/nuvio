'use client'

import { InfoIcon, SearchIcon } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'
import { useGetWorkspaceById } from '@/features/workspaces/api/use-get-workspace-by-id'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

export const Toolbar = () => {
  const workspaceId = useWorkspaceId()
  const { data } = useGetWorkspaceById({ id: workspaceId })

  return (
    <nav className="flex h-10 items-center justify-between bg-indigo-500 p-1.5">
      <div className="flex-1" />
      <div className="min-w-[280px] max-w-[642px] shrink grow-[2]">
        <Button
          className="hover:bg-accent-25 h-7 w-full justify-start bg-accent/25 px-5"
          size="sm"
        >
          <SearchIcon className="mr-2 size-4 text-white" />
          <span>Procurar {data?.name}</span>
        </Button>
      </div>
      <div className="ml-auto flex flex-1 items-center justify-end">
        <Button variant="transparent" size="iconSm">
          <InfoIcon className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  )
}
