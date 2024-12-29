import { config, store } from '@/common/store'
import Column from '@/components/column'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'

export default observer(() => {
  const [width, setWidth] = useState(
    config.isMobile ? document.body.clientWidth : store.columns * store.columnWidth
  )

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      setWidth(config.isMobile ? document.body.clientWidth : store.columns * store.columnWidth)
    })
    resizeObserver.observe(document.body)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const widthLen = store.navPath.length * store.columnWidth
  const leftLen = Math.max(store.navPath.length - store.columns, 0) * -store.columnWidth

  return (
    <div
      className="z-[1] flex shadow-[5px_0_10px_rgba(0,0,0,0.03)]"
      style={{ flex: `0 0 ${width}px` }}
    >
      <div
        className="flex transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(${leftLen}px)`, flex: `0 0 ${widthLen}px` }}
      >
        {store.navPath.map(unit => {
          return (
            <Column
              key={unit.uid}
              uid={unit.uid}
            ></Column>
          )
        })}
      </div>
    </div>
  )
})
