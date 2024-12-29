import { httpModName } from '@/common/api'
import EventBus from '@/common/event-bus'
import { store, synckit, type Unit } from '@/common/store'
import UnitView from '@/components/unit-view'
import Input from '@/ui-components/input'
import Modal from '@/ui-components/modal'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'

type IProps = {
  uid: number
  onCancel?: () => void
}

export default observer<IProps>(props => {
  const [unit, setUnit] = useState<Unit | undefined>()
  const [name, setName] = useState('')

  useEffect(() => {
    const unit = store.units.get(props.uid)
    setUnit(unit)
    setName(unit?.name || '')
  }, [])

  async function onOk() {
    try {
      await synckit.delegateHttp(() =>
        httpModName({
          uid: props.uid,
          newName: name,
        })
      )

      EventBus.emit('TOAST', {
        msg: '修改名称成功',
        type: 'success',
      })

      onCancel()
    } catch (e) {
      EventBus.emit('TOAST', {
        msg: `修改名称失败：${(e as Error).message}`,
        type: 'error',
      })
    }
  }

  function onCancel() {
    props.onCancel?.()
  }

  return (
    unit && (
      <Modal
        title="修改名称"
        size="tiny"
        onOk={onOk}
        onCancel={onCancel}
        useLoading={true}
      >
        <UnitView
          uid={props.uid}
          type={unit.type}
          name={unit.name}
          ntype={unit.ntype}
        ></UnitView>
        <Input
          onChange={setName}
          value={name}
          autoFocus={true}
        ></Input>
      </Modal>
    )
  )
})
