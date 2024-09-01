'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { CgSpinner } from 'react-icons/cg'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

import { useCreateWorkspace } from '../api/use-create-workspace'
import { useCreateWorkspaceModal } from '../store/use-create-workspace-modal'

export const CreateWorkspaceModal = () => {
  const { push } = useRouter()
  const [open, setOpen] = useCreateWorkspaceModal()
  const { mutate, isPending } = useCreateWorkspace()
  const [name, setName] = useState('')
  const { toast } = useToast()

  function handleClose() {
    setOpen(false)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    mutate(
      { name },
      {
        onSuccess: ({ workspaceId }) => {
          push(`/workspaces/${workspaceId}`)
          toast({
            title: 'Área de trabalho criada',
            description: 'Você será redirecionado para a nova área de trabalho',
            variant: 'success',
          })
          handleClose()
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar uma área de trabalho</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            disabled={isPending}
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
            autoFocus
            minLength={3}
            placeholder="Nome da área de trabalho"
            list="workspaces"
          />

          <div className="mt-2 flex w-full justify-end">
            <Button type="submit" disabled={isPending} className="w-20">
              {isPending ? (
                <CgSpinner className="size-4 animate-spin" />
              ) : (
                'Criar'
              )}
            </Button>
          </div>
        </form>

        <datalist id="workspaces">
          <option value="Work" />
          <option value="Personal" />
          <option value="Home" />
        </datalist>
      </DialogContent>
    </Dialog>
  )
}
