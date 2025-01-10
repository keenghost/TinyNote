import { store } from '@src/common/store'
import BookView from '@src/components/book-view'
import Modal from '@src/ui-components/modal'
import { observer } from 'mobx-react-lite'

export default observer(() => {
  function handleUpdate(inValue: string) {
    store.updateNote(store.contentId, inValue)
  }

  const unit = store.units.get(store.contentId)
  const note = store.getNote(store.contentId)

  return (
    unit && (
      <Modal
        size="full"
        useBackAction={true}
        useNoTitle={true}
        useNoFooter={true}
        onCancel={() => store.updateContentId(0)}
      >
        <BookView
          uid={unit.uid}
          name={unit.name}
          ntype={unit.ntype}
          value={note}
          handleUpdate={handleUpdate}
        ></BookView>
      </Modal>
    )
  )
})
