import { store } from '@src/common/store'
import Button from '@src/ui-components/button'
import { observer } from 'mobx-react-lite'

export default observer(() => {
  function onPathClick(inId: number) {
    store.updateFolderId(inId)
    store.updateChosenId(inId)
  }

  return (
    <div className="z-[1] flex h-48 items-center shadow-[0_4px_8px_rgba(0,0,0,0.03)]">
      <div className="flex flex-1 items-center overflow-x-auto whitespace-nowrap">
        {store.navPath.map((item, index) => (
          <div
            className="flex max-w-[240px] items-center"
            key={item.uid}
          >
            <Button
              key={item.uid}
              onClick={() => onPathClick(item.uid)}
              className="flex-1 text-ellipsis whitespace-nowrap"
              type="transparent"
              disabled={index === store.navPath.length - 1}
            >
              {index === 0 ? '根目录' : item.name}
            </Button>
            {index !== store.navPath.length - 1 ? (
              <div className="png-arrow h-12 w-12 bg-contain bg-center bg-no-repeat"></div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
})
