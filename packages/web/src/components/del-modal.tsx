import { httpDel } from '@src/common/api'
import EventBus from '@src/common/event-bus'
import { store, synckit } from '@src/common/store'
import UnitView from '@src/components/unit-view'
import Modal from '@src/ui-components/modal'
import { observer } from 'mobx-react-lite'

type IProps = {
  uid: number
  onCancel?: () => void
}

export default observer<IProps>(props => {
  async function onOk() {
    try {
      await synckit.delegateHttp(() => httpDel({ uid: props.uid }))

      EventBus.emit('TOAST', {
        msg: '删除成功',
        type: 'success',
      })

      onCancel()
    } catch (e) {
      EventBus.emit('TOAST', {
        msg: `删除失败：${(e as Error).message}`,
        type: 'error',
      })
    }
  }

  function onCancel() {
    props.onCancel?.()
  }

  const unit = store.units.get(props.uid)

  return (
    unit && (
      <Modal
        title="删除"
        size="tiny"
        onOk={onOk}
        onCancel={onCancel}
        okButtonType="error"
        useLoading={true}
      >
        <UnitView
          uid={props.uid}
          type={unit.type}
          name={unit.name}
          ntype={unit.ntype}
        ></UnitView>
      </Modal>
    )
  )
})
