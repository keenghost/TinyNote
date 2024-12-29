import { store } from '@/common/store'
import BookView from '@/components/book-view'
import { observer } from 'mobx-react-lite'

export default observer(() => {
  function handleUpdate(inValue: string) {
    store.updateNote(store.contentId, inValue)
  }

  const unit = store.units.get(store.contentId)
  const note = store.getNote(store.contentId)

  return (
    unit && (
      <BookView
        uid={unit.uid}
        name={unit.name}
        ntype={unit.ntype}
        value={note}
        handleUpdate={handleUpdate}
      ></BookView>
    )
  )
})
