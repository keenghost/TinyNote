import { config, store } from '@src/common/store'
import BookView from '@src/components/book-view'
import Modal from '@src/ui-components/modal'
import { observer } from 'mobx-react-lite'

interface IProps {
  uid: number
  viewType: 'mod' | 'new'
  onCancel?: () => void
}

export default observer<IProps>(props => {
  const unit = store.units.get(props.uid)
  const modUnit = store.modUnits.get(props.uid)

  if (props.viewType === 'new') {
    return (
      unit && (
        <Modal
          size={config.isMobile ? 'full' : 'extra-large'}
          useBackAction={config.isMobile}
          useNoTitle={true}
          useNoFooter={config.isMobile}
          useNoOkButton={true}
          cancelButtonText="关闭"
          onCancel={() => props.onCancel?.()}
          className="min-h-[600px]"
        >
          <BookView
            uid={props.uid}
            name={unit.name}
            ntype={unit.ntype}
            value={unit.note}
            readonly={true}
          ></BookView>
        </Modal>
      )
    )
  } else {
    return (
      modUnit && (
        <Modal
          size={config.isMobile ? 'full' : 'extra-large'}
          useBackAction={config.isMobile}
          useNoTitle={true}
          useNoFooter={config.isMobile}
          useNoOkButton={true}
          cancelButtonText="关闭"
          onCancel={() => props.onCancel?.()}
          className="min-h-[600px]"
        >
          <BookView
            uid={props.uid}
            name={unit?.name || modUnit.name}
            ntype={modUnit.ntype}
            value={modUnit.note}
            readonly={true}
          ></BookView>
        </Modal>
      )
    )
  }
})
