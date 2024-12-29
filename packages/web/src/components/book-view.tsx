import EventBus from '@/common/event-bus'
import KeyValue from '@/plugins/keyvalue'
import Markdown from '@/plugins/md'
import Txt from '@/plugins/txt'
import { ENOTE_TYPE } from '@/types/common'
import Button from '@/ui-components/button'
import { useEffect, useState } from 'react'

interface IProps {
  uid: number
  name: string
  ntype: ENOTE_TYPE
  value: string
  handleUpdate?: (inValue: string) => void
  readonly?: boolean
}

export default (props: IProps) => {
  const [editMode, setEditMode] = useState<'source' | 'preview'>('preview')

  useEffect(() => {
    const toggleEditMode = () => {
      setEditMode(prev => (prev === 'source' ? 'preview' : 'source'))
    }

    EventBus.on('TOGGLE_EDITOR_MODE', toggleEditMode)

    return () => {
      EventBus.off('TOGGLE_EDITOR_MODE', toggleEditMode)
    }
  }, [])

  useEffect(() => {
    setEditMode('preview')
  }, [props.uid])

  function handleUpdate(inValue: string) {
    props.handleUpdate?.(inValue)
  }

  function getNoteIconClass() {
    switch (props.ntype) {
      case ENOTE_TYPE.TXT:
        return 'png-txt'
      case ENOTE_TYPE.MARKDOWN:
        return 'png-md'
      case ENOTE_TYPE.KEYVALUE:
        return 'png-kv'
      default:
        return ''
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      {!!props.uid && (
        <>
          <div className="z-[1] flex h-48 items-center justify-between px-8 shadow-[0_4px_8px_rgba(0,0,0,0.03)]">
            <div className="flex flex-1 items-center">
              <div
                className={[
                  'mr-8 h-28 w-28 bg-contain bg-center bg-no-repeat',
                  getNoteIconClass(),
                ].join(' ')}
              ></div>
              <div className="flex-1 text-ellipsis whitespace-nowrap">{props.name}</div>
            </div>

            <div className="flex h-48 items-center">
              {props.readonly && <div className="mr-4">只读</div>}
              <Button
                size="tiny"
                type={editMode === 'source' ? 'primary' : 'default'}
                className="rounded-r-none"
                onClick={() => setEditMode('source')}
              >
                源码
              </Button>
              <Button
                size="tiny"
                type={editMode === 'preview' ? 'primary' : 'default'}
                className="rounded-l-none"
                onClick={() => setEditMode('preview')}
              >
                预览
              </Button>
            </div>
          </div>

          {props.ntype === ENOTE_TYPE.TXT && (
            <Txt
              value={props.value}
              onChange={handleUpdate}
              className="w-full flex-1"
              editMode={editMode}
              readonly={props.readonly}
            ></Txt>
          )}

          {props.ntype === ENOTE_TYPE.MARKDOWN && (
            <Markdown
              value={props.value}
              onChange={handleUpdate}
              className="w-full flex-1"
              editMode={editMode}
              readonly={props.readonly}
            ></Markdown>
          )}

          {props.ntype === ENOTE_TYPE.KEYVALUE && (
            <KeyValue
              value={props.value}
              onChange={handleUpdate}
              className="w-full flex-1"
              editMode={editMode}
              readonly={props.readonly}
            ></KeyValue>
          )}
        </>
      )}
    </div>
  )
}
