import { TrashIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useRemoveWorkspace } from '@/features/workspaces/api/use-remove-workspace'
import { useUpdateWorkspace } from '@/features/workspaces/api/use-update-workspace'
import { useConfirm } from '@/hooks/use-confirm'
import { useToast } from '@/hooks/use-toast'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  initialValue: string
}

export const PreferencesModal = ({ initialValue, open, setOpen }: Props) => {
  const workspaceId = useWorkspaceId()
  const [value, setValue] = useState(initialValue)
  const [editOpen, setEditOpen] = useState(false)
  const [ConfirmDialog, confirm] = useConfirm({
    title: 'Remover área de trabalho',
    message:
      'Esta ação não poderá ser desfeita. Ao remover a área de trabalho, automaticamente você removerá todos os membros a ela existentes.',
  })
  const { toast } = useToast()
  const { replace } = useRouter()

  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
    useUpdateWorkspace()
  const { mutate: removeWorkspace, isPending: isRemovingWorkspace } =
    useRemoveWorkspace()

  function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    updateWorkspace(
      {
        id: workspaceId,
        name: value,
      },
      {
        onSuccess: () => {
          setEditOpen(false)
          toast({
            title: 'Área de trabalho renomeada com sucesso',
          })
        },
        onError: () => {
          toast({
            title: 'Erro ao renomear área de trabalho',
            variant: 'destructive',
          })
        },
      },
    )
  }

  async function handleRemove() {
    const ok = await confirm()

    if (!ok) return

    removeWorkspace(
      {
        id: workspaceId,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Área de trabalho removida com sucesso',
          })
          replace('/')
        },
        onError: () => {
          toast({
            title: 'Erro ao remover área de trabalho',
            variant: 'destructive',
          })
        },
      },
    )
  }

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden bg-gray-50 p-0">
          <DialogHeader className="border-b bg-white p-4">
            <DialogTitle>{initialValue}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-y-2 px-4 pb-4">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <div className="cursor-pointer rounded-lg border bg-white px-5 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">
                      Nome da área de trabalho{' '}
                    </p>
                    <p className="text-sm font-semibold text-indigo-500 hover:underline">
                      Editar
                    </p>
                  </div>
                  <p className="text-sm">{value}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Renomear área de trabalho</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleEdit}>
                  <Input
                    value={value}
                    disabled={isUpdatingWorkspace}
                    onChange={(e) => setValue(e.target.value)}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="Digite o nome da área de trabalho"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isUpdatingWorkspace}
                      >
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdatingWorkspace}>Salvar</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <button
              disabled={isRemovingWorkspace}
              onClick={handleRemove}
              className="flex cursor-pointer items-center gap-x-2 rounded-lg border bg-white px-5 py-4 text-rose-500 hover:bg-gray-50"
            >
              <TrashIcon className="size-4" />
              <p className="text-sm font-semibold">Deletar área de trabalho</p>
            </button>

            {/* <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
              <DialogTrigger asChild>
                <button
                  disabled={isRemovingWorkspace}
                  className="flex cursor-pointer items-center gap-x-2 rounded-lg border bg-white px-5 py-4 text-rose-500 hover:bg-gray-50"
                >
                  <TrashIcon className="size-4" />
                  <p className="text-sm font-semibold">
                    Deletar área de trabalho
                  </p>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Remover área de trabalho ({initialValue})
                  </DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                  Esta ação não poderá ser desfeita. Ao remover a área de
                  trabalho, automaticamente você removerá todos os membros a ela
                  existentes.
                </p>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" disabled={isRemovingWorkspace}>
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button onClick={handleRemove} variant="destructive">
                    Remover
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog> */}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
