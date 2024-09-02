import { ChevronDownIcon, ListFilter, SquarePenIcon } from 'lucide-react'
import React, { useState } from 'react'

import { Hint } from '@/components/hint'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Doc } from '../../../../../convex/_generated/dataModel'
import { InviteModal } from './invite-modal'
import { PreferencesModal } from './preferences-modal'

type Props = {
  workspace: Doc<'workspaces'>
  isAdmin: boolean
}

export const WorkspaceHeader = ({ workspace, isAdmin }: Props) => {
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)

  return (
    <>
      <InviteModal
        open={inviteOpen}
        setOpen={setInviteOpen}
        name={workspace.name}
        joinCode={workspace.joinCode}
      />
      <PreferencesModal
        open={preferencesOpen}
        setOpen={setPreferencesOpen}
        initialValue={workspace.name}
      />
      <div className="flex h-[49px] items-center justify-between gap-0.5 px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="transparent"
              size="sm"
              className="w-auto overflow-hidden p-1.5 text-lg font-semibold"
            >
              <span className="truncate">{workspace.name}</span>
              <ChevronDownIcon className="ml-2 size-4 shrink-0" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" side="bottom" className="w-64">
            <DropdownMenuItem className="cursor-pointer capitalize">
              <div className="relative mr-2 flex size-9 items-center justify-center overflow-hidden rounded-md bg-muted-foreground text-xl font-semibold text-white">
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col items-start">
                <p className="font-bold">{workspace.name}</p>
                <p className="text-xs text-muted-foreground">
                  Área de trabalho ativa
                </p>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {isAdmin && (
              <>
                <DropdownMenuItem
                  className="cursor-pointer py-2"
                  onClick={() => setInviteOpen(true)}
                >
                  Convide membros para {workspace.name}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="cursor-pointer py-2"
                  onClick={() => setPreferencesOpen(true)}
                >
                  Preferências
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-0.5">
          <Hint label="Filtrar" side="bottom">
            <Button variant="transparent" size="iconSm">
              <ListFilter className="size-4" />
            </Button>
          </Hint>
          <Hint label="Nova mensagem" side="bottom">
            <Button variant="transparent" size="iconSm">
              <SquarePenIcon className="size-4" />
            </Button>
          </Hint>
        </div>
      </div>
    </>
  )
}
