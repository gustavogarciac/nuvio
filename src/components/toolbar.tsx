import {
  MessageSquareIcon,
  PencilIcon,
  SmileIcon,
  TrashIcon,
} from 'lucide-react'
import React from 'react'

import { EmojiPopover } from './emoji-popover'
import { Hint } from './hint'
import { Button } from './ui/button'

interface Props {
  isAuthor: boolean
  isPending: boolean
  handleEdit: () => void
  handleThread: () => void
  handleDelete: () => void
  handleReaction: (value: string) => void
  hideThreadButton?: boolean
}

export const Toolbar = ({
  isAuthor,
  isPending,
  handleEdit,
  handleThread,
  handleDelete,
  handleReaction,
  hideThreadButton,
}: Props) => {
  return (
    <div className="absolute right-5 top-0">
      <div className="rounded-md border bg-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
        <EmojiPopover
          hint="Reagir"
          onEmojiSelect={(emoji) => handleReaction(emoji.native)}
        >
          <Button
            variant="ghost"
            size="iconSm"
            disabled={isPending}
            onClick={() => {}}
          >
            <SmileIcon className="size-4" />
          </Button>
        </EmojiPopover>
        {!hideThreadButton && (
          <Hint label="Responder em tópico">
            <Button
              variant="ghost"
              size="iconSm"
              disabled={isPending}
              onClick={() => {}}
            >
              <MessageSquareIcon className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <>
            <Hint label="Editar mensagem">
              <Button
                variant="ghost"
                size="iconSm"
                disabled={isPending}
                onClick={() => {}}
              >
                <PencilIcon className="size-4" />
              </Button>
            </Hint>
            <Hint label="Deletar mensagem">
              <Button
                variant="ghost"
                size="iconSm"
                disabled={isPending}
                onClick={() => {}}
              >
                <TrashIcon className="size-4" />
              </Button>
            </Hint>
          </>
        )}
      </div>
    </div>
  )
}
