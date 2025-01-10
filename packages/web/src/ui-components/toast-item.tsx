import PngButton from '@src/ui-components/png-button'
import { useEffect } from 'react'

interface IProps {
  msg: string
  tid: string
  type?: 'default' | 'info' | 'success' | 'warning' | 'error'
  closable?: boolean
  duration?: number
  actions?: React.ReactNode
  onClose?: (inTid: string) => void
}

export default (props: IProps) => {
  useEffect(() => {
    const duration = props.duration === 0 ? 0 : props.duration || 3000
    let timer = 0

    if (duration > 0) {
      timer = window.setTimeout(() => {
        props.onClose?.(props.tid)
      }, duration)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [])

  function getBgColor(inType?: string) {
    switch (inType) {
      case 'info':
        return 'bg-blue-600'
      case 'success':
        return 'bg-green-600'
      case 'warning':
        return 'bg-yellow-600'
      case 'error':
        return 'bg-red-600'
      default:
        return 'bg-gray-600'
    }
  }

  return (
    <div className="pointer-events-none mb-8 flex items-center justify-center">
      <div
        className={[
          'rounded-3 pointer-events-auto flex max-w-full items-center px-12 py-8',
          getBgColor(props.type),
        ].join(' ')}
      >
        <div className="flex-1 text-white">{props.msg}</div>

        <div className="ml-4">{props.actions}</div>

        {props.closable && (
          <PngButton
            size="extra-tiny"
            pngClass="png-close"
            className="ml-4"
            onClick={() => props.onClose?.(props.tid)}
          ></PngButton>
        )}
      </div>
    </div>
  )
}
