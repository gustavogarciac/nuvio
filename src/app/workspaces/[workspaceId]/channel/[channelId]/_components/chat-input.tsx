import dynamic from 'next/dynamic'
import Quill from 'quill'
import React, { useRef } from 'react'

const Editor = dynamic(() => import('@/components/editor'), {
  ssr: false,
})

type ChatInputProps = {
  placeholder: string
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null)

  return (
    <div className="w-full px-5">
      <Editor
        placeholder={placeholder}
        onSubmit={() => {}}
        disabled={false}
        innerRef={editorRef}
      />
    </div>
  )
}
