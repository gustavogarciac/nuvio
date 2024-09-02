import { CopyIcon, RefreshCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { usePatchWorkspaceJoinCode } from '@/features/workspaces/api/use-patch-join-code-workspace'
import { useConfirm } from '@/hooks/use-confirm'
import { useToast } from '@/hooks/use-toast'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  name: string
  joinCode: string
}

export const InviteModal = ({ open, setOpen, name, joinCode }: Props) => {
  const workspaceId = useWorkspaceId()
  const { mutate, isPending } = usePatchWorkspaceJoinCode()
  const { toast } = useToast()
  const [ConfirmDialog, confirm] = useConfirm({
    title: 'Você tem certeza que deseja gerar um novo código?',
    message:
      'Isso irá invalidar o código atual e todos os convites pendentes serão cancelados.',
  })

  function handleCopyInviteLink() {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`

    navigator.clipboard.writeText(inviteLink).then(() => {
      toast({
        title: 'Link de convite copiado',
      })
    })
  }

  async function handleNewJoinCode() {
    const ok = await confirm()

    if (!ok) {
      return
    }

    mutate(
      {
        workspaceId,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Código de convite atualizado',
          })
        },
        onError: () => {
          toast({
            title: 'Erro ao atualizar código de convite',
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convidar membros para {name}</DialogTitle>
            <DialogDescription>
              Use o código abaixo para convidar membros para a sua área de
              trabalho.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-y-4 py-10">
            <p className="text-4xl font-bold uppercase tracking-widest">
              {joinCode}
            </p>
            <Button variant="ghost" size="sm" onClick={handleCopyInviteLink}>
              Copiar link de convite
              <CopyIcon className="ml-2 size-4" />
            </Button>
          </div>
          <div className="flex w-full items-center justify-between">
            <Button
              disabled={isPending}
              onClick={handleNewJoinCode}
              variant="outline"
            >
              Novo código
              <RefreshCcw className="ml-2 size-4" />
            </Button>
            <DialogClose asChild>
              <Button>Fechar</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
