import dynamic from 'next/dynamic'
import Quill from 'quill'
import React, { useRef } from 'react'

import { useCreateMessage } from '@/features/messages/api/use-create-message'
import { useGenerateUploadUrl } from '@/features/upload/api/use-generate-upload-url'
import { useChannelId } from '@/hooks/use-channel-id'
import { useToast } from '@/hooks/use-toast'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

import { Id } from '../../../../../../../convex/_generated/dataModel'

const Editor = dynamic(() => import('@/components/editor'), {
  ssr: false,
})

type ChatInputProps = {
  placeholder: string
}

type CreateMessageValues = {
  channelId: Id<'channels'>
  workspaceId: Id<'workspaces'>
  body: string
  image?: Id<'_storage'>
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [editorKey, setEditorKey] = React.useState(0)
  const [isPending, setIsPending] = React.useState(false)
  const editorRef = useRef<Quill | null>(null)
  const { mutate: createMessage } = useCreateMessage()
  const { mutate: generateUpload } = useGenerateUploadUrl()

  const { toast } = useToast()

  const workspaceId = useWorkspaceId()
  const channelId = useChannelId()

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string
    image: File | null | undefined
  }) => {
    try {
      setIsPending(true)
      editorRef?.current?.enable(false)

      const values: CreateMessageValues = {
        channelId,
        workspaceId,
        body,
        image: undefined,
      }

      if (image) {
        const url = await generateUpload({}, { throwError: true })

        if (!url) {
          throw new Error('Failed to generate upload URL')
        }

        const result = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': image.type },
          body: image,
        })

        if (!result.ok) {
          throw new Error('Failed to upload image')
        }

        const { storageId } = await result.json()

        values.image = storageId
      }

      await createMessage(values, { throwError: true })

      setEditorKey((prevKey) => prevKey + 1)
    } catch (error) {
      toast({
        title: 'Erro ao enviar a mensagem',
        description: 'Por favor, tente novamente.',
      })
    } finally {
      setIsPending(false)
      editorRef?.current?.enable(true)
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
