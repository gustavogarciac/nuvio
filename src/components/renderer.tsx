import Quill from 'quill'
import React from 'react'

interface RendererProps {
  value: string
}

const Renderer = ({ value }: RendererProps) => {
  const [isEmpty, setIsEmpty] = React.useState(false)
  const rendererRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!rendererRef.current) return

    const container = rendererRef.current

    const quill = new Quill(document.createElement('div'), {
      theme: 'snow',
    })

    quill.enable(false)

    const contents = JSON.parse(value)
    quill.setContents(contents)

    const isEmpty =
      quill
        .getText()
        .replace(/<(.|\n)*?>/g, '')
        .trim().length === 0

    setIsEmpty(isEmpty)

    container.innerHTML = quill.root.innerHTML

    return () => {
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [value])

  if (isEmpty) return null

  return <div ref={rendererRef} className="ql-editor ql-renderer" />
}

export default Renderer
