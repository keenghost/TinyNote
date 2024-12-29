import { httpAdd } from '@/common/api'
import EventBus from '@/common/event-bus'
import { synckit } from '@/common/store'
import { ENOTE_TYPE, EUNIT_TYPE } from '@/types/common'
import Input from '@/ui-components/input'
import Modal from '@/ui-components/modal'
import { useState } from 'react'

type IProps = {
  uid: number
  onCancel?: () => void
}

export default (props: IProps) => {
  const [name, setName] = useState('')

  async function onOk() {
    try {
      await synckit.delegateHttp(() =>
        httpAdd({
          type: EUNIT_TYPE.FOLDER,
          name: name,
          pid: props.uid,
          ntype: ENOTE_TYPE.MARKDOWN,
        })
      )

      EventBus.emit('TOAST', {
        msg: '新建文件夹成功',
        type: 'success',
      })

      onCancel()
    } catch (e) {
      EventBus.emit('TOAST', {
        msg: `新建文件夹失败：${(e as Error).message}`,
        type: 'error',
      })
    }
  }

  function onCancel() {
    props.onCancel?.()
  }

  return (
    <Modal
      title="新增文件夹"
      size="tiny"
      onOk={onOk}
      onCancel={onCancel}
      useLoading={true}
    >
      <div className="">
        <Input
          onChange={setName}
          value={name}
          placeholder="新文件夹名称"
          autoFocus={true}
        ></Input>
      </div>
    </Modal>
  )
}
