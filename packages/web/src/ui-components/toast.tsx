import EventBus from '@src/common/event-bus'
import { getRandomString } from '@src/common/utils'
import ToastItem from '@src/ui-components/toast-item'
import { useEffect, useState } from 'react'

export interface IToastMessage {
  msg: string
  tid?: string
  type?: 'default' | 'info' | 'success' | 'warning' | 'error'
  closable?: boolean
  duration?: number
  actions?: React.ReactNode
}

export default () => {
  const [toasts, setToasts] = useState<(Omit<IToastMessage, 'tid'> & { tid: string })[]>([])

  useEffect(() => {
    EventBus.on('TOAST', (inToast: IToastMessage) => {
      setToasts(prev => {
        const newPrev = prev.filter(toast => toast.tid !== inToast.tid)
        const newTid = inToast.tid || getRandomString()
        newPrev.push({ ...inToast, tid: newTid })

        return newPrev
      })
    })
  }, [])

  function onClose(inTid: string) {
    setToasts(prev => prev.filter(toast => toast.tid !== inTid))
  }

  return (
    <div className="pointer-events-none fixed left-8 right-8 top-4 z-[9999]">
      {toasts.map(toast => (
        <ToastItem
          key={toast.tid}
          msg={toast.msg}
          tid={toast.tid}
          type={toast.type}
          closable={toast.closable}
          duration={toast.duration}
          actions={toast.actions}
          onClose={inTid => onClose(inTid)}
        ></ToastItem>
      ))}
    </div>
  )
}
