import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'

interface IProps {
  value: string
  onChange: (value: string) => void
  className?: string
  editMode?: 'source' | 'preview'
  readonly?: boolean
}

export default (props: IProps) => {
  const [isComposition, setIsComposition] = useState(false)
  const [curNote, setCurNote] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleUpdate(inValue: string) {
    props.onChange(inValue)
  }

  function onCompositionStart() {
    setIsComposition(true)
  }

  useEffect(() => {
    if (props.readonly) {
      return
    }

    if (props.editMode === 'source') {
      textareaRef.current?.focus()
    }
  }, [props.editMode])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.addEventListener('onCompositionStart', onCompositionStart)
    }

    return () => {
      if (textareaRef.current) {
        textareaRef.current.removeEventListener('onCompositionStart', onCompositionStart)
      }
    }
  }, [textareaRef.current])

  if (props.editMode === 'source') {
    if (props.readonly) {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: props.value }}
          className={[
            'text-18 overflow-auto whitespace-pre p-8 leading-[1.3]',
            props.className,
          ].join(' ')}
        ></div>
      )
    }

    return (
      <textarea
        className={[
          'text-18 resize-none overflow-auto whitespace-pre bg-slate-100 p-8 leading-[1.3] outline-none',
          props.className,
        ].join(' ')}
        value={props.value}
        onChange={e => {
          setCurNote(e.target.value)

          if (!isComposition) {
            handleUpdate(e.target.value)
          }
        }}
        onCompositionEnd={() => {
          setIsComposition(false)
          handleUpdate(curNote)
        }}
        ref={textareaRef}
      ></textarea>
    )
  }

  return (
    <div className={['overflow-auto p-8', props.className].join(' ')}>
      <ReactMarkdown className="prose lg:prose-xl">{props.value}</ReactMarkdown>
    </div>
  )
}
