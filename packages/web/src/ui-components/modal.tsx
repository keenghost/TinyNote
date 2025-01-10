import EventBus from '@src/common/event-bus'
import { historyManager } from '@src/common/history-mgr'
import { getRandomString } from '@src/common/utils'
import Button, { type IButtonType } from '@src/ui-components/button'
import { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'

interface IProps {
  title?: string
  className?: string
  style?: React.CSSProperties
  size?: 'full' | 'extra-large' | 'large' | 'medium' | 'small' | 'tiny' | 'auto'
  children: React.ReactNode
  onOk?: (() => void) | (() => Promise<void>)
  onCancel?: () => void
  okButtonType?: IButtonType
  useBackAction?: boolean
  useNoTitle?: boolean
  useNoFooter?: boolean
  okButtonText?: string
  cancelButtonText?: string
  useNoOkButton?: boolean
  useNoCancelButton?: boolean
  loading?: boolean
  useLoading?: boolean
}

export default (props: IProps) => {
  const [loading, setLoading] = useState(false)
  const actionIdRef = useRef(getRandomString())

  useEffect(() => {
    const onBackAction = (inActionId: string) => {
      if (inActionId === actionIdRef.current) {
        props.onCancel?.()
      }
    }

    if (props.useBackAction) {
      EventBus.on('BACK_ACTION', onBackAction)

      const actionId = getRandomString()
      actionIdRef.current = actionId
      historyManager.addActionId(actionId)
    }

    return () => {
      if (props.useBackAction) {
        EventBus.off('BACK_ACTION', onBackAction)
      }
    }
  }, [])

  async function onOk() {
    try {
      if (props.useLoading) {
        setLoading(true)
      }

      await props.onOk?.()
    } catch (e) {
      throw e
    } finally {
      if (props.useLoading) {
        setLoading(false)
      }
    }
  }

  function getSizeStyle() {
    const size = props.size || 'auto'

    switch (size) {
      case 'full':
        return {
          width: '100%',
          height: '100%',
          padding: 0,
          borderRadius: 0,
        }
      case 'extra-large':
        return { width: '1200px' }
      case 'large':
        return { width: '800px' }
      case 'medium':
        return { width: '640px' }
      case 'small':
        return { width: '480px' }
      case 'tiny':
        return { width: '320px' }
      default:
        return {}
    }
  }

  function getPaddingClass() {
    if (props.size === 'full') {
      return ''
    }

    return 'p-16'
  }

  return ReactDOM.createPortal(
    <div
      className={[
        'fixed bottom-0 left-0 right-0 top-0 z-[999] flex items-center justify-center bg-[rgba(0,0,0,0.5)]',
        getPaddingClass(),
      ].join(' ')}
    >
      <div
        className={[
          'rounded-3 relative flex max-h-full max-w-full flex-col bg-white p-16 shadow-2xl',
          props.className,
        ].join(' ')}
        style={Object.assign(getSizeStyle(), props.style)}
        onClick={e => e.stopPropagation()}
      >
        {props.useNoTitle ? null : <div className="text-18 mb-16 font-bold">{props.title}</div>}

        <div className="flex flex-1 flex-col">{props.children}</div>

        {props.useNoFooter ? null : (
          <div className="mt-16 flex items-center justify-end gap-8">
            {!props.useNoCancelButton && (
              <Button
                size="small"
                onClick={props.onCancel}
              >
                {props.cancelButtonText || '取消'}
              </Button>
            )}
            {!props.useNoOkButton && (
              <Button
                size="small"
                onClick={onOk}
                type={props.okButtonType || 'primary'}
              >
                {props.okButtonText || '确定'}
              </Button>
            )}
          </div>
        )}

        {(props.loading || loading) && (
          <div className="rounded-3 absolute bottom-0 left-0 right-0 top-0 z-[1] flex items-center justify-center bg-[rgba(255,255,255,0.5)]">
            <div className="modal-loading"></div>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
