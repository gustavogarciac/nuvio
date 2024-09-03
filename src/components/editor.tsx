import 'quill/dist/quill.snow.css'

import { ImageIcon, Smile, XIcon } from 'lucide-react'
import Image from 'next/image'
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
  const [image, setImage] = useState<File | null>(null)
  const [isToolbarVisible, setToolbarVisible] = useState(true)

  const containerRef = useRef<HTMLDivElement>(null)
  const submitRef = useRef(onSubmit)
  const placeholderRef = useRef(placeholder)
  const quillRef = useRef<Quill | null>(null)
  const defaultValueRef = useRef(defaultValue)
  const disabledRef = useRef(disabled)
  const imageElementRef = useRef<HTMLInputElement>(null)

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
              handler: () => {
                const text = quill.getText()
                const addedImage = imageElementRef.current?.files?.[0] || null

                const isEmpty =
                  !addedImage &&
                  text.replace(/<(.|\n)*?>/g, '').trim().length === 0

                if (isEmpty) return

                const body = JSON.stringify(quill.getContents())

                submitRef.current?.({ body, image: addedImage })
              },
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

  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, '').trim().length === 0
  const toggleToolbar = () => {
    setToolbarVisible((current) => !current)
    const toolbarElement = containerRef.current?.querySelector('.ql-toolbar')

    if (toolbarElement) {
      toolbarElement.classList.toggle('hidden')
    }
  }

  function onEmojiSelect(emojiValue: string) {
    const quill = quillRef.current

    quill?.insertText(quill?.getSelection()?.index ?? 0, emojiValue)
  }

  return (
    <div className="flex flex-col">
      <input
        type="file"
        accept="image/*"
        ref={imageElementRef}
        onChange={(e) => setImage(e.target.files![0])}
        className="hidden"
      />
      <div
        className={cn(
          'focus-whitin:border-slate-300 flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white transition focus-within:shadow-sm',
          disabled && 'opacity-50',
        )}
      >
        <div ref={containerRef} className="ql-custom h-full" />
        {!!image && (
          <div className="p-2">
            <div className="group/image relative flex size-[62px] items-center justify-center">
              <Hint label="Remover imagem">
                <button
                  onClick={() => {
                    setImage(null)
                    imageElementRef.current!.value = ''
                  }}
                  className="absolute -right-2.5 -top-2.5 z-[4] hidden size-6 items-center justify-center rounded-full border-2 border-white bg-black/70 text-white hover:bg-black group-hover/image:flex"
                >
                  <XIcon className="size-3.5" />
                </button>
              </Hint>
              <Image
                src={URL.createObjectURL(image)}
                alt="Uploaded"
                fill
                className="overflow-hidden rounded-xl border object-cover"
              />
            </div>
          </div>
        )}
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
                onClick={() => imageElementRef.current?.click()}
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
                onClick={onCancel}
                disabled={isEmpty || disabled}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  onSubmit({
                    body: JSON.stringify(quillRef.current?.getContents()),
                    image,
                  })
                }
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
              onClick={() =>
                onSubmit({
                  body: JSON.stringify(quillRef.current?.getContents()),
                  image,
                })
              }
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
