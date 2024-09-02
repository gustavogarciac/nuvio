'use client'

import { PlusIcon } from 'lucide-react'
import { FaCaretDown } from 'react-icons/fa'
import { useToggle } from 'react-use'

import { Hint } from '@/components/hint'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  label: string
  hint: string
  onNew?: () => void
}

export const WorkspaceSection = ({ children, hint, label, onNew }: Props) => {
  const [on, toggle] = useToggle(true)

  return (
    <div className="mt-3 flex flex-col px-2">
      <div className="group flex items-center px-3.5">
        <Button
          variant="transparent"
          className="size-6 shrink-0 p-0.5 text-sm text-secondary/90"
          onClick={toggle}
        >
          <FaCaretDown
            className={cn('size-4 transition-transform', on && '-rotate-90')}
          />
        </Button>
        <Button
          variant="transparent"
          size="sm"
          className="group h-[28px] items-center justify-start overflow-hidden px-1.5 text-sm text-secondary/90"
        >
          <span className="truncate">{label}</span>
        </Button>

        {onNew && (
          <Hint label={hint} side="top" align="center">
            <Button
              onClick={onNew}
              variant="transparent"
              size="iconSm"
              className="ml-auto size-6 shrink-0 p-0.5 text-sm text-secondary/90 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <PlusIcon className="size-5 shrink-0" />
            </Button>
          </Hint>
        )}
      </div>
      {on && children}
    </div>
  )
}
