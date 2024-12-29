import { type RefObject, useImperativeHandle, useRef } from 'react'

export interface IInputMethods {
  focus: () => void
}

interface IProps {
  value: string
  onChange?: (value: string) => void
  className?: string
  style?: React.CSSProperties
  placeholder?: string
  autoFocus?: boolean
  methods?: RefObject<IInputMethods>
}

export default (props: IProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(
    props.methods,
    () => ({
      focus,
    }),
    []
  )

  function focus() {
    inputRef.current?.focus()
  }

  return (
    <input
      type="text"
      value={props.value}
      onChange={e => props.onChange?.(e.target.value)}
      tabIndex={-1}
      className={[
        'rounded-3 bg-gray-200 px-12 py-6 outline-none focus:outline-none',
        props.className,
      ].join(' ')}
      style={props.style}
      placeholder={props.placeholder}
      autoFocus={props.autoFocus}
      ref={inputRef}
    />
  )
}
