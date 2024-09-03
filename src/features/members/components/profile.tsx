import {
  AlertTriangle,
  ChevronDownIcon,
  Loader,
  MailIcon,
  XIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { useConfirm } from '@/hooks/use-confirm'
import { useToast } from '@/hooks/use-toast'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

import { Id } from '../../../../convex/_generated/dataModel'
import { useCurrentMember } from '../api/use-current-member'
import { useGetMember } from '../api/use-get-member'
import { useRemoveMember } from '../api/use-remove-member'
import { useUpdateMember } from '../api/use-update-member'

type Props = {
  memberId: Id<'members'>
  onClose: () => void
}

export const Profile = ({ memberId, onClose }: Props) => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    useCurrentMember({
      workspaceId,
    })
  const { data: member, isLoading: isLoadingMember } = useGetMember({
    memberId,
  })

  const [UpdateDialog, confirmUpdate] = useConfirm({
    title: 'Alterar cargo',
    message: 'Você tem certeza que deseja alterar o cargo deste membro?',
  })
  const [LeaveDialog, confirmLeave] = useConfirm({
    title: 'Sair da área de trabalho',
    message: 'Você deseja sair da área de trabalho?',
  })
  const [RemoveDialog, confirmRemove] = useConfirm({
    title: 'Remover membro',
    message: 'Você deseja remover este membro?',
  })

  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember()
  const { mutate: removeMember, isPending: isRemovingMember } =
    useRemoveMember()

  const { toast } = useToast()

  const onRemove = async () => {
    const ok = await confirmRemove()

    if (!ok) {
      return
    }

    removeMember(
      {
        id: memberId,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Membro removido com sucesso.',
          })
          onClose()
        },
        onError: () => {
          toast({
            title: 'Erro ao remover membro.',
          })
        },
      },
    )
  }

  const onLeave = async () => {
    const ok = await confirmLeave()

    if (!ok) {
      return
    }

    removeMember(
      {
        id: memberId,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Você saiu da área de trabalho.',
          })
          router.replace('/')
          onClose()
        },
        onError: () => {
          toast({
            title: 'Erro ao sair da área de trabalho.',
          })
        },
      },
    )
  }

  const onUpdate = async (role: 'admin' | 'member') => {
    const ok = await confirmUpdate()

    if (!ok) {
      return
    }

    updateMember(
      {
        id: memberId,
        role,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Cargo atualizado com sucesso.',
          })
          onClose()
        },
        onError: () => {
          toast({
            title: 'Falha ao atualizar cargo.',
          })
        },
      },
    )
  }

  const fallback = member?.user?.name?.charAt(0).toUpperCase() ?? 'M'

  if (isLoadingMember || isLoadingCurrentMember) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex h-[49px] items-center justify-between border-b px-4">
          <p className="text-lg font-bold">Perfil</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex h-full items-center justify-center">
          <Loader className="size-4 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex h-[49px] items-center justify-between border-b px-4">
          <p className="text-lg font-bold">Perfil</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex h-full flex-col items-center justify-center gap-2">
          <AlertTriangle className="size-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Perfil não encontrado!
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <UpdateDialog />
      <LeaveDialog />
      <RemoveDialog />

      <div className="flex h-full flex-col">
        <div className="flex h-[49px] items-center justify-between border-b px-4">
          <p className="text-lg font-bold">Perfil</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center p-4">
          <Avatar className="size-full max-h-[230px] max-w-[230px] rounded-md">
            <AvatarImage
              className="rounded-md object-cover"
              src={member.user.image}
            />
            <AvatarFallback className="aspect-square rounded-md bg-indigo-500 text-4xl text-white">
              {fallback}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col p-4">
          <p className="text-xl font-bold">{member.user.name}</p>
          {currentMember?.role === 'admin' &&
          currentMember?._id !== memberId ? (
            <div className="mt-4 flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    disabled={isUpdatingMember}
                    variant="outline"
                    className="w-full capitalize"
                  >
                    {member.role} <ChevronDownIcon className="ml-2 size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuRadioGroup
                    value={member.role}
                    onValueChange={(role) =>
                      onUpdate(role as 'admin' | 'member')
                    }
                  >
                    <DropdownMenuRadioItem value={'admin'}>
                      Administrador
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={'member'}>
                      Membro
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                disabled={isRemovingMember}
                className="w-full"
                onClick={onRemove}
              >
                Remover
              </Button>
            </div>
          ) : currentMember?._id === memberId &&
            currentMember?.role !== 'admin' ? (
            <div className="mt-4">
              <Button
                disabled={isRemovingMember}
                variant="outline"
                className="w-full"
                onClick={onLeave}
              >
                Sair da área de trabalho
              </Button>
            </div>
          ) : null}
        </div>

        <Separator />

        <div className="flex flex-col p-4">
          <p className="mb-4 text-sm font-bold">Informações de contato</p>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-md bg-muted">
              <MailIcon className="size-4 text-muted-foreground" />
            </div>

            <div className="flex flex-col">
              <p className="text-xs font-semibold text-muted-foreground">
                Endereço de email
              </p>
              <Link
                href={`mailto:${member.user.email}`}
                className="text-sm text-indigo-500 hover:underline"
              >
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
