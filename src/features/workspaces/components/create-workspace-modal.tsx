'use client'

import React from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { useCreateWorkspaceModal } from '../store/use-create-workspace-modal'

export const CreateWorkspaceModal = () => {
  const [open, setOpen] = useCreateWorkspaceModal()

  function handleClose() {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar uma área de trabalho</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
