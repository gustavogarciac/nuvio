import { AlertTriangle, Loader, XIcon } from 'lucide-react'
import React, { useState } from 'react'

import { Message } from '@/components/message'
import { Button } from '@/components/ui/button'
import { useCurrentMember } from '@/features/members/api/use-current-member'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

import { Id } from '../../../../convex/_generated/dataModel'
import { useGetMessage } from '../api/use-get-message'

interface ThreadProps {
  messageId: Id<'messages'>
  onClose: () => void
}

export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const workspaceId = useWorkspaceId()
  const [editingId, setEditingId] = useState<Id<'messages'> | null>(null)
  const { data: currentMember } = useCurrentMember({ workspaceId })
  const { data: message, isLoading: isMessageLoading } = useGetMessage({
    messageId,
  })

  if (isMessageLoading) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex h-[49px] items-center justify-between border-b px-4">
          <p className="text-lg font-bold">Tópico</p>
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

  if (!message) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex h-[49px] items-center justify-between border-b px-4">
          <p className="text-lg font-bold">Tópico</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex h-full flex-col items-center justify-center gap-2">
          <AlertTriangle className="size-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Esta mensagem não foi encontrada!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[49px] items-center justify-between border-b px-4">
        <p className="text-lg font-bold">Tópico</p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div>
        <Message
          hideThreadButton
          memberId={message.memberId}
          authorImage={message.user.image}
          authorName={message.user.name}
          isAuthor={message.memberId === currentMember?._id}
          body={message.body}
          image={message.image}
          createdAt={message._creationTime}
          updatedAt={message.updatedAt}
          id={message._id}
          reactions={message.reactions}
          isEditing={editingId === message._id}
          setEditingId={setEditingId}
        />
      </div>
    </div>
  )
}
