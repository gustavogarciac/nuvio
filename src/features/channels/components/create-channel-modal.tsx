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
import { useWorkspaceId } from '@/hooks/use-workspace-id'

import { useCreateChannel } from '../api/use-create-channel'
import { useCreateChannelModal } from '../store/use-create-channel-modal'

export const CreateChannelModal = () => {
  const [open, setOpen] = useCreateChannelModal()
  const [name, setName] = useState('')
  const workspaceId = useWorkspaceId()
  const { toast } = useToast()

  const { mutate, isPending } = useCreateChannel()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '-').toLowerCase()
    setName(value)
  }

  const handleClose = () => {
    setOpen(false)
    setName('')
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate(
      {
        name,
        workspaceId,
      },
      {
        onSuccess: () => {
          handleClose()
          toast({
            title: `Canal ${name} criado com sucesso.`,
            description: 'Você será redirecionado para o canal.',
          })
          // TODO: Redirect
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Canal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            disabled={isPending}
            onChange={handleChange}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder="Nome do canal"
          />
          <div className="flex justify-end">
            <Button className="w-16" disabled={isPending}>
              {isPending ? (
                <CgSpinner className="size-4 animate-spin" />
              ) : (
                'Criar'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
