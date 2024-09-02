'use client'

import { TrashIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'

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
import { useRemoveChannel } from '@/features/channels/api/use-remove-channel'
import { useUpdateChannel } from '@/features/channels/api/use-update-channel'
import { useCurrentMember } from '@/features/members/api/use-current-member'
import { useChannelId } from '@/hooks/use-channel-id'
import { useConfirm } from '@/hooks/use-confirm'
import { useToast } from '@/hooks/use-toast'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

type Props = {
  channelName: string
}

export const Header = ({ channelName }: Props) => {
  const channelId = useChannelId()
  const workspaceId = useWorkspaceId()
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [value, setValue] = useState(channelName)
  const { mutate: updateChannel, isPending: updatingChannel } =
    useUpdateChannel()
  const { mutate: removeChannel, isPending: isRemovingChannel } =
    useRemoveChannel()
  const [ConfirmDialog, confirm] = useConfirm({
    title: 'Deletar canal',
    message:
      'Tem certeza que deseja deletar este canal? Esta ação é irreversível.',
  })
  const { data: member } = useCurrentMember({ workspaceId })
  const { toast } = useToast()

  const handleEditOpen = (value: boolean) => {
    if (member?.role !== 'admin') return
    setEditOpen(value)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '-').toLowerCase()
    setValue(value)
  }

  const handleDelete = async () => {
    const ok = await confirm()

    if (!ok) return

    removeChannel(
      {
        id: channelId,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Canal deletado com sucesso',
            description: 'O canal foi deletado com sucesso',
          })
          router.push(`/workspaces/${workspaceId}`)
        },
        onError: () => {
          toast({
            title: 'Erro ao deletar canal',
            description: 'Ocorreu um erro ao tentar deletar o canal',
            variant: 'destructive',
          })
        },
      },
    )
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    updateChannel(
      {
        id: channelId,
        name: value,
      },
      {
        onSuccess: () => {
          setEditOpen(false)
          toast({
            title: 'Canal atualizado com sucesso',
            description: `O canal foi renomeado para ${value}`,
          })
        },
        onError: () => {
          setValue(channelName)
          toast({
            title: 'Erro ao atualizar canal',
            description: 'Ocorreu um erro ao tentar atualizar o canal',
            variant: 'destructive',
          })
        },
      },
    )
  }

  return (
    <>
      <ConfirmDialog />
      <div className="flex h-[49px] items-center overflow-hidden border-b bg-white px-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-auto overflow-hidden px-2 text-lg font-semibold"
              size="sm"
            >
              <span className="truncate"># {channelName}</span>
              <FaChevronDown className="ml-2 size-2.5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="overflow-hidden bg-gray-50 p-0">
            <DialogHeader className="border-b bg-white p-4">
              <DialogTitle># {channelName}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-y-2 px-4 pb-4">
              <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                <DialogTrigger asChild>
                  <div className="cursor-pointer rounded-lg border bg-white px-5 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Nome do canal</p>
                      {member?.role === 'admin' && (
                        <p className="text-sm font-semibold text-indigo-600 hover:underline">
                          Editar
                        </p>
                      )}
                    </div>
                    <p className="text-sm"># {channelName}</p>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Renomear este canal</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      value={value}
                      disabled={updatingChannel}
                      onChange={handleChange}
                      required
                      autoFocus
                      minLength={3}
                      maxLength={80}
                      placeholder="Digite o nome do canal"
                    />

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" disabled={updatingChannel}>
                          Cancelar
                        </Button>
                      </DialogClose>
                      <Button disabled={updatingChannel}>Salvar</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {member?.role === 'admin' && (
                <button
                  onClick={handleDelete}
                  disabled={isRemovingChannel}
                  className="flex cursor-pointer items-center gap-x-2 rounded-lg border bg-white px-5 py-4 text-rose-500 hover:bg-gray-50"
                >
                  <TrashIcon className="size-4" />
                  <p className="text-sm font-semibold">Deletar canal</p>
                </button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
