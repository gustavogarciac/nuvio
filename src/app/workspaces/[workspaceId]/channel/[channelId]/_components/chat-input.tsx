import dynamic from 'next/dynamic'
import Quill from 'quill'
import React, { useRef } from 'react'

import { useCreateMessage } from '@/features/messages/api/use-create-message'
import { useChannelId } from '@/hooks/use-channel-id'
import { useToast } from '@/hooks/use-toast'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

const Editor = dynamic(() => import('@/components/editor'), {
  ssr: false,
})

type ChatInputProps = {
  placeholder: string
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [editorKey, setEditorKey] = React.useState(0)
  const [isPending, setIsPending] = React.useState(false)
  const editorRef = useRef<Quill | null>(null)
  const { mutate: createMessage } = useCreateMessage()

  const { toast } = useToast()

  const workspaceId = useWorkspaceId()
  const channelId = useChannelId()

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string
    image: File | null
  }) => {
    try {
      setIsPending(true)
      await createMessage(
        {
          body,
          workspaceId,
          channelId,
        },
        { throwError: true },
      )

      setEditorKey((prevKey) => prevKey + 1)
    } catch (error) {
      toast({
        title: 'Erro ao enviar a mensagem',
        description: 'Por favor, tente novamente.',
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="w-full px-5">
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
      />
    </div>
  )
}
