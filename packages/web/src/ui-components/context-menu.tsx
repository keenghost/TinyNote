import EventBus from '@/common/event-bus'
import { useEffect, useRef, useState } from 'react'

type IContextDirection = 'LT' | 'LB' | 'RT' | 'RB' | 'TL' | 'TR' | 'BL' | 'BR'

type IMenuItem = {
  item: React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number
  callback: (() => void) | (() => Promise<void>)
  children?: Array<IMenuItem>
  checked?: boolean
}

export type IContextMenu = {
  event?: React.MouseEvent
  menus: Array<IMenuItem>
  onEnter?: () => void
  onCancel?: () => void
  extra?: {
    useElement?: {
      element: HTMLElement
      direction?: IContextDirection
      offset?: { top?: number; right?: number; bottom?: number; left?: number }
    }
    useCustomChecked?: boolean
  }
}

export default () => {
  const [menu, setMenu] = useState<IContextMenu>()
  const [backupMenu, setBackupMenu] = useState<IContextMenu>()
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    backupMenu?.onCancel?.()

    menu?.onEnter?.()

    setBackupMenu(menu)
  }, [menu])

  function show(inContextMenu: IContextMenu) {
    inContextMenu.event?.preventDefault()
    inContextMenu.event?.stopPropagation()

    setMenu(inContextMenu)
  }

  function windowClick(Event: MouseEvent) {
    if (divRef.current && divRef.current.contains(Event.target as Node)) {
      return
    }

    cancel()
  }

  function scroll() {
    cancel()
  }

  function PreventContextMenu(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()

    return false
  }

  function cancel() {
    setMenu(undefined)
  }

  function throttle(inFunc: () => void) {
    let canRun = true

    return () => {
      if (!canRun) {
        return
      }

      canRun = false
      setTimeout(() => (canRun = true), 100)
      inFunc()
    }
  }

  useEffect(() => {
    const scrollThrottled = throttle(scroll)

    EventBus.on('SHOW_MENU', InContextMenu => {
      show(InContextMenu)
    })

    window.addEventListener('click', windowClick, { capture: true })
    window.addEventListener('scroll', scrollThrottled, {
      capture: true,
    })

    return () => {
      window.removeEventListener('click', windowClick)
      window.removeEventListener('scroll', scrollThrottled)
    }
  }, [])

  function getPositionStyle() {
    const newStyle: { top?: string; right?: string; bottom?: string; left?: string } = {}

    if (!menu) {
      return newStyle
    }

    if (menu.event) {
      const x = menu.event.pageX
      const y = menu.event.pageY
      const clientWidth = document.documentElement.clientWidth
      const clientHeight = document.documentElement.clientHeight
      const offset = 1

      const isLeft = x - clientWidth / 2 < 0
      const isTop = y - clientHeight / 2 < 0

      let direction: 'LT' | 'LB' | 'RT' | 'RB' = 'RB'

      if (isLeft) {
        if (isTop) {
          direction = 'RB'
        } else {
          direction = 'RT'
        }
      } else {
        if (isTop) {
          direction = 'LB'
        } else {
          direction = 'LT'
        }
      }

      switch (direction) {
        case 'LT':
          newStyle.right = `${clientWidth - x + offset}px`
          newStyle.bottom = `${clientHeight - y + offset}px`
          break
        case 'LB':
          newStyle.top = `${y + offset}px`
          newStyle.right = `${clientWidth - x + offset}px`
          break
        case 'RT':
          newStyle.bottom = `${clientHeight - y + offset}px`
          newStyle.left = `${x + offset}px`
          break
        case 'RB':
          newStyle.top = `${y + offset}px`
          newStyle.left = `${x + offset}px`
          break
      }
    } else if (menu.extra?.useElement) {
      if (menu.extra.useElement.element) {
        const rect = menu.extra.useElement.element.getBoundingClientRect()
        // const x = rect.left + window.scrollX + Menu.Extra.UseElement.Element.offsetWidth
        // const y = rect.top + window.scrollY + Menu.Extra.UseElement.Element.offsetHeight

        // NewStyle.top = `${y}px`
        // NewStyle.left = `${x}px`
        // NewStyle.left = `${rect.left + window.scrollY}px`

        const clientWidth = document.documentElement.clientWidth
        const clientHeight = document.documentElement.clientHeight
        const direction = menu.extra.useElement.direction || 'LB'
        const offsetTop = menu.extra.useElement.offset?.top || 0
        const offsetRight = menu.extra.useElement.offset?.right || 0
        const offsetBottom = menu.extra.useElement.offset?.bottom || 0
        const offsetLeft = menu.extra.useElement.offset?.left || 0

        switch (direction) {
          case 'LT':
            newStyle.top = `${rect.top + window.scrollY - offsetTop}px`
            newStyle.left = `${rect.left + window.scrollX - offsetLeft}px`
            break
          case 'LB':
            newStyle.top = `${rect.top + window.scrollY + rect.height + offsetBottom}px`
            newStyle.left = `${rect.left + window.scrollX - offsetLeft}px`
            break
          case 'RT':
            newStyle.top = `${rect.top + window.scrollY - offsetTop}px`
            newStyle.left = `${rect.left + window.scrollX + rect.width + offsetRight}px`
            break
          case 'RB':
            newStyle.top = `${rect.top + window.scrollY + rect.height + offsetBottom}px`
            newStyle.left = `${rect.left + window.scrollX + rect.width + offsetRight}px`
            break
          case 'TL':
            newStyle.bottom = `${clientHeight - (rect.top + window.scrollX) - offsetBottom}px`
            newStyle.left = `${rect.left + window.scrollX - offsetLeft}px`
            break
          case 'TR':
            newStyle.bottom = `${clientHeight - (rect.top + window.scrollY) + offsetTop}px`
            newStyle.right = `${clientWidth - (rect.left + window.scrollX + rect.width) + offsetRight}px`
            break
          case 'BL':
            newStyle.top = `${rect.top + window.scrollY + rect.height + offsetBottom}px`
            newStyle.left = `${rect.left + window.scrollX - offsetLeft}px`
            break
          case 'BR':
            newStyle.top = `${rect.top + window.scrollY + rect.height + offsetBottom}px`
            newStyle.right = `${clientWidth - (rect.left + window.scrollX + rect.width) + offsetRight}px`
            break
        }
      }
    }

    return newStyle
  }

  function getMenuNodes(inMenus: Array<IMenuItem>) {
    return inMenus.map((menuItem, index) => {
      return (
        <div
          className="context-menu-item h-30 has-hover:hover:bg-[rgba(255,228,196,1)] relative flex min-w-[150px] max-w-[400px] items-center overflow-visible px-12 py-8"
          onClickCapture={e => {
            e.preventDefault()
            e.stopPropagation()
            menuItem.callback()
            cancel()
          }}
          key={index}
        >
          {menuItem.item}
          {!menu?.extra?.useCustomChecked && menuItem.checked ? (
            <div className="png-checked ml-8 h-24 w-24 bg-contain bg-center bg-no-repeat"></div>
          ) : null}
          {menuItem.children ? (
            <div className="png-arrow absolute bottom-0 right-4 top-0 w-12 bg-contain bg-center bg-no-repeat"></div>
          ) : null}
          {menuItem.children ? (
            <div className="context-menu-sub absolute left-full top-0 hidden min-w-[150px] max-w-[400px] bg-[rgba(255,255,255,1)] shadow-[0_0_10px_rgba(0,0,0,0.2)]">
              {getMenuNodes(menuItem.children)}
            </div>
          ) : null}
        </div>
      )
    })
  }

  return (
    <div
      className="context-menu fixed z-[10000] min-w-[150px] max-w-[400px] cursor-default overflow-visible bg-[rgba(255,255,255,1)] shadow-[0_0_10px_rgba(0,0,0,0.2)]"
      style={getPositionStyle()}
      onContextMenu={PreventContextMenu}
      ref={divRef}
    >
      {menu ? (menu.menus ? getMenuNodes(menu.menus) : null) : null}
    </div>
  )
}
