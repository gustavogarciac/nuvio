import React from 'react'
import { MdOutlineAddReaction } from 'react-icons/md'

import { useCurrentMember } from '@/features/members/api/use-current-member'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { cn } from '@/lib/utils'

import { Doc, Id } from '../../convex/_generated/dataModel'
import { EmojiPopover } from './emoji-popover'
import { Hint } from './hint'

interface ReactionsProps {
  data: Array<
    Omit<Doc<'reactions'>, 'memberId'> & {
      count: number
      memberIds: Id<'members'>[]
    }
  >
  onChange: (value: string) => void
}

export const Reactions = ({ data, onChange }: ReactionsProps) => {
  const workspaceId = useWorkspaceId()
  const { data: currentMember } = useCurrentMember({ workspaceId })

  const currentMemberId = currentMember?._id

  if (data.length === 0 || !currentMemberId) {
    return null
  }

  return (
    <div className="mb-1 mt-1 flex items-center gap-1">
      {data.map((reaction) => (
        <Hint
          label={`${reaction.count} ${reaction.count === 1 ? 'pessoa reagiu' : 'pessoas reagiram'} com ${reaction.value}`}
          key={reaction._id}
        >
          <button
            onClick={() => onChange(reaction.value)}
            key={reaction._id}
            className={cn(
              'flex h-6 items-center gap-x-1 rounded-md border border-transparent bg-slate-200/70 px-2 text-slate-800',
              reaction.memberIds.includes(currentMemberId) &&
                'border-indigo-100 bg-indigo-100/70 text-white',
            )}
          >
            {reaction.value}
            <span
              className={cn(
                'text-xs font-semibold text-muted-foreground',
                reaction.memberIds.includes(currentMemberId) &&
                  'text-indigo-500',
              )}
            >
              {reaction.count}
            </span>
          </button>
        </Hint>
      ))}
      <EmojiPopover
        hint="Adicionar reação"
        onEmojiSelect={(emoji) => onChange(emoji)}
      >
        <button className="flex h-6 items-center gap-x-1 rounded-md border border-transparent bg-slate-200/70 px-3 text-slate-800 hover:border-slate-500">
          <MdOutlineAddReaction className="size-4" />
        </button>
      </EmojiPopover>
    </div>
  )
}
