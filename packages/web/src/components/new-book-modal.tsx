import { httpAdd } from '@/common/api'
import EventBus from '@/common/event-bus'
import { synckit } from '@/common/store'
import { ENOTE_TYPE, EUNIT_TYPE } from '@/types/common'
import Input, { type IInputMethods } from '@/ui-components/input'
import Modal from '@/ui-components/modal'
import { useRef, useState } from 'react'

const ENewItems = [
  { type: ENOTE_TYPE.TXT, pngClass: 'png-txt', name: 'txt' },
  { type: ENOTE_TYPE.MARKDOWN, pngClass: 'png-md', name: 'md' },
  { type: ENOTE_TYPE.KEYVALUE, pngClass: 'png-keyvalue', name: 'key-value' },
]

type IProps = {
  uid: number
  onCancel?: () => void
}

export default (props: IProps) => {
  const [curType, setCurType] = useState<ENOTE_TYPE>(ENOTE_TYPE.TXT)
  const [name, setName] = useState('')
  const inputRef = useRef<IInputMethods>({ focus: () => {} })

  function onFileIconClick(Type: ENOTE_TYPE) {
    setCurType(Type)
    inputRef.current?.focus()
  }

  async function onOk() {
    try {
      await synckit.delegateHttp(() =>
        httpAdd({
          type: EUNIT_TYPE.BOOK,
          name: name,
          pid: props.uid,
          ntype: curType,
        })
      )

      EventBus.emit('TOAST', {
        msg: '新建笔记成功',
        type: 'success',
      })

      onCancel()
    } catch (e) {
      EventBus.emit('TOAST', {
        msg: `新建笔记失败：${(e as Error).message}`,
        type: 'error',
      })
    }
  }

  function onCancel() {
    props.onCancel?.()
  }

  function getChosenClass(inType: ENOTE_TYPE) {
    if (inType === curType) {
      return 'bg-slate-200 has-hover:hover:bg-slate-200'
    }

    return 'has-hover:hover:bg-slate-100'
  }

  return (
    <Modal
      title="新增笔记"
      size="tiny"
      onOk={onOk}
      onCancel={onCancel}
      useLoading={true}
    >
      <div className="mb-8">
        {ENewItems.map(newItem => (
          <div
            className={[
              'rounded-4 m-2 inline-block min-w-80 p-8',
              getChosenClass(newItem.type),
            ].join(' ')}
            onClick={() => onFileIconClick(newItem.type)}
            key={newItem.type}
            style={{ minWidth: '80px' }}
          >
            <div className="flex flex-col items-center">
              <div
                className={[
                  'mb-8 h-28 w-28 bg-contain bg-center bg-no-repeat',
                  newItem.pngClass,
                ].join(' ')}
              ></div>
              <div>{newItem.name}</div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <Input
          value={name}
          onChange={inStr => setName(inStr)}
          placeholder="新笔记名称"
          autoFocus={true}
          methods={inputRef}
        ></Input>
      </div>
    </Modal>
  )
}
