'use client'

import { Loader, PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { CgSpinner } from 'react-icons/cg'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useGetWorkspaceById } from '@/features/workspaces/api/use-get-workspace-by-id'
import { useGetWorkSpaces } from '@/features/workspaces/api/use-get-workspaces'
import { useCreateWorkspaceModal } from '@/features/workspaces/store/use-create-workspace-modal'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

export const WorkspaceSwitcher = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setOpen] = useCreateWorkspaceModal()
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspaceById({
    id: workspaceId,
  })
  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkSpaces()

  const filteredWorkspaces = workspaces?.filter((w) => w._id !== workspaceId)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative size-9 overflow-hidden bg-accent text-xl font-semibold text-slate-800 hover:bg-accent/80">
          {workspaceLoading ? (
            <CgSpinner className="size-5 shrink-0 animate-spin" />
          ) : (
            workspace?.name.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuItem
          onClick={() => router.push(`/workspaces/${workspaceId}`)}
          className="cursor-pointer flex-col items-start justify-start capitalize"
        >
          {workspace?.name}
          <span className="text-xs text-muted-foreground">
            Área de trabalho ativa
          </span>
        </DropdownMenuItem>

        {!workspacesLoading &&
          filteredWorkspaces?.map((w) => (
            <DropdownMenuItem
              key={w._id}
              className="cursor-pointer capitalize"
              onClick={() => router.push(`/workspaces/${w._id}`)}
            >
              <div className="relative mr-2 flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted-foreground text-lg font-semibold text-secondary">
                {w.name.charAt(0).toUpperCase()}
              </div>
              <p className="line-clamp-1">{w.name}</p>
            </DropdownMenuItem>
          ))}

        {workspacesLoading && (
          <DropdownMenuItem className="cursor-not-allowed">
            <Loader className="size-5 animate-spin" />
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          className="group cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="relative mr-2 flex size-9 items-center justify-center overflow-hidden rounded-md bg-accent/90 text-lg font-semibold text-slate-800 group-hover:bg-muted-foreground/20">
            <PlusIcon />
          </div>
          Criar nova área de trabalho
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
