import data from '@emoji-mart/data'
import i18n from '@emoji-mart/data/i18n/pt.json'
import Picker from '@emoji-mart/react'
import { useState } from 'react'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'

interface EmojiPopoverProps {
  children: React.ReactNode
  hint?: string
  onEmojiSelect: (emoji: { native: string }) => void
}

export const EmojiPopover = ({
  children,
  hint = 'Emoji',
  onEmojiSelect,
}: EmojiPopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const onSelect = (emojiObject: unknown) => {
    onEmojiSelect(emojiObject as { native: string })
    setPopoverOpen(false)

    setTimeout(() => {
      setTooltipOpen(false)
    }, 500)
  }

  return (
    <TooltipProvider>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <Tooltip
          open={tooltipOpen}
          onOpenChange={setTooltipOpen}
          delayDuration={50}
        >
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className="border border-white/5 bg-black text-white">
            <p className="text-xs font-medium">{hint}</p>
          </TooltipContent>
        </Tooltip>

        <PopoverContent className="w-full border-none p-0 shadow-none">
          <Picker i18n={i18n} data={data} onEmojiSelect={onSelect} />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  )
}
