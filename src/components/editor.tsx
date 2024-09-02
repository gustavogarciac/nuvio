import 'quill/dist/quill.snow.css'

import { ImageIcon, Smile } from 'lucide-react'
import Quill, { QuillOptions } from 'quill'
import { Delta, Op } from 'quill/core'
import React, {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { MdSend } from 'react-icons/md'
import { PiTextAa } from 'react-icons/pi'

import { cn } from '@/lib/utils'

import { EmojiPopover } from './emoji-popover'
import { Hint } from './hint'
import { Button } from './ui/button'

type EditorValue = {
  image: File | null
  body: string
}

type EditorProps = {
  variant?: 'create' | 'update'
  onSubmit: ({ image, body }: EditorValue) => void
  onCancel?: () => void
  placeholder?: string
  defaultValue?: Delta | Op[]
  disabled?: boolean
  innerRef?: MutableRefObject<Quill | null>
}

const Editor = ({
  variant = 'create',
  onSubmit,
  defaultValue,
  disabled = false,
  innerRef,
  onCancel,
  placeholder,
}: EditorProps) => {
  const [text, setText] = useState('')
  const [isToolbarVisible, setToolbarVisible] = useState(true)

  const containerRef = useRef<HTMLDivElement>(null)
  const submitRef = useRef(onSubmit)
  const placeholderRef = useRef(placeholder)
  const quillRef = useRef<Quill | null>(null)
  const defaultValueRef = useRef(defaultValue)
  const disabledRef = useRef(disabled)

  useLayoutEffect(() => {
    submitRef.current = onSubmit
    placeholderRef.current = placeholder
    defaultValueRef.current = defaultValue
    disabledRef.current = disabled
  })

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    const editorContainer = container.appendChild(
      container.ownerDocument.createElement('div'),
    )

    const options: QuillOptions = {
      theme: 'snow',
      placeholder: placeholderRef.current,
      modules: {
        keyboard: {
          bindings: {
            enter: {
              key: 'Enter',
              /* TODO: SUBMIT FORM */
              handler: () => {},
            },
            shift_enter: {
              key: 'Enter',
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, '\n')
              },
            },
          },
        },
        toolbar: [
          ['bold', 'italic', 'strike'],
          ['link'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['clean'],
        ],
      },
    }

    const quill = new Quill(editorContainer, options)

    quillRef.current = quill
    quillRef.current.focus()

    if (innerRef) {
      innerRef.current = quill
    }

    quill.setContents(defaultValueRef.current!)
    setText(quill.getText())

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText())
    })

    return () => {
      quill.off(Quill.events.TEXT_CHANGE)

      if (container) {
        container.innerHTML = ''
      }
      if (quillRef.current) {
        quillRef.current = null
      }
      if (innerRef) {
        innerRef.current = null
      }
    }
  }, [innerRef])

  const isEmpty = text.replace(/<(.|\n)*?>/g, '').trim().length === 0
  const toggleToolbar = () => {
    setToolbarVisible((current) => !current)
    const toolbarElement = containerRef.current?.querySelector('.ql-toolbar')

    if (toolbarElement) {
      toolbarElement.classList.toggle('hidden')
    }
  }

  function onEmojiSelect(emoji: { native: string }) {
    const quill = quillRef.current

    quill?.insertText(quill?.getSelection()?.index || 0, emoji.native)
  }

  return (
    <div className="flex flex-col">
      <div className="focus-whitin:border-slate-300 flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white transition focus-within:shadow-sm">
        <div ref={containerRef} className="ql-custom h-full" />
        <div className="z-[5] flex px-2 pb-2">
          <Hint label={isToolbarVisible ? 'Esconder formatação' : 'Formatar'}>
            <Button
              variant="ghost"
              disabled={disabled}
              size={'iconSm'}
              onClick={toggleToolbar}
            >
              <PiTextAa className="size-4" />
            </Button>
          </Hint>
          <EmojiPopover onEmojiSelect={onEmojiSelect}>
            <Button variant="ghost" disabled={disabled} size={'iconSm'}>
              <Smile className="size-4" />
            </Button>
          </EmojiPopover>
          {variant === 'create' && (
            <Hint label="Imagem">
              <Button
                variant="ghost"
                disabled={disabled}
                size={'iconSm'}
                onClick={() => {}}
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          )}
          {variant === 'update' && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {}}
                disabled={isEmpty || disabled}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={() => {}}
                disabled={isEmpty || disabled}
                className="bg-emerald-500 text-white hover:bg-emerald-500/80"
              >
                Salvar
              </Button>
            </div>
          )}
          {variant === 'create' && (
            <Button
              disabled={isEmpty || disabled}
              onClick={() => {}}
              size={'iconSm'}
              className={cn(
                'ml-auto',
                isEmpty
                  ? 'bg-white text-muted-foreground hover:bg-white'
                  : 'bg-emerald-500 text-white hover:bg-emerald-500/80',
              )}
            >
              <MdSend className="size-4" />
            </Button>
          )}
        </div>
      </div>
      {variant === 'create' && (
        <div
          className={cn(
            'flex justify-end p-2 text-[10px] text-muted-foreground opacity-0 transition',
            !isEmpty && 'opacity-100',
          )}
        >
          <p>
            <strong>Shift + Return</strong> para adicionar uma linha nova
          </p>
        </div>
      )}
    </div>
  )
}

export default Editor
