import EventBus from '@/common/event-bus'
import NewBookModal from '@/components/new-book-modal'
import NewFolderModal from '@/components/new-folder-modal'
import PngButton from '@/ui-components/png-button'
import { useRef, useState } from 'react'

interface IProps {
  uid: number
}

export default (props: IProps) => {
  const [newBookModalVisible, setNewBookModalVisible] = useState(false)
  const [newFolderModalVisible, setNewFolderModalVisible] = useState(false)
  const divRef = useRef<HTMLDivElement>(null)

  function onClick() {
    EventBus.emit('SHOW_MENU', {
      menus: [
        {
          callback: () => setNewBookModalVisible(true),
          item: <div>新增笔记</div>,
        },
        {
          callback: () => setNewFolderModalVisible(true),
          item: <div>新增文件夹</div>,
        },
      ],
      extra: {
        useElement: {
          element: divRef.current!,
          direction: 'TR',
          offset: { right: 3 },
        },
      },
    })
  }

  return (
    <div
      ref={divRef}
      className="absolute bottom-16 right-16"
    >
      <PngButton
        size="small"
        pngClass="png-add"
        onClick={onClick}
      ></PngButton>

      {newBookModalVisible && (
        <NewBookModal
          uid={props.uid}
          onCancel={() => setNewBookModalVisible(false)}
        ></NewBookModal>
      )}

      {newFolderModalVisible && (
        <NewFolderModal
          uid={props.uid}
          onCancel={() => setNewFolderModalVisible(false)}
        ></NewFolderModal>
      )}
    </div>
  )
}
