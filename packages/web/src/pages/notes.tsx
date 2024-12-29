import { httpProfile } from '@/common/api'
import EventBus from '@/common/event-bus'
import { store, synckit } from '@/common/store'
import { config } from '@/common/store'
import BookArea from '@/components/book-area'
import BookModal from '@/components/book-modal'
import Explorer from '@/components/explorer'
import Header from '@/components/header'
import Nav from '@/components/nav'
import Button from '@/ui-components/button'
import ContextMenu from '@/ui-components/context-menu'
import Toast from '@/ui-components/toast'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'

export default observer(() => {
  useEffect(() => {
    if (config.isMobile) {
      window.addEventListener('beforeunload', () => {
        return 'true'
      })

      window.history.pushState(10086, '')
      window.addEventListener('popstate', () => {
        history.go(1)

        if (window.history.state === 10086) {
          EventBus.emit('HISTORY_BACK')
        }
      })

      EventBus.on('BACK_ACTION', inActionId => {
        if (inActionId) {
          return
        }

        if (store.navPath.length <= 1) {
          return
        }

        const targetFolderUnit = store.navPath[store.navPath.length - 2]

        if (!targetFolderUnit) {
          return
        }

        store.updateFolderId(targetFolderUnit.uid)
      })
    }

    window.addEventListener(
      'keydown',
      e => {
        switch (e.key) {
          case 'F1':
            e.preventDefault()
            // Search
            break
          case 'F2':
            e.preventDefault()
            EventBus.emit('TOGGLE_EDITOR_MODE')
            break
          default:
            break
        }
      },
      {
        capture: true,
      }
    )

    EventBus.on('SHOW_SIGN_ERROR', () => {
      EventBus.emit('TOAST', {
        msg: '本地加密密钥与服务器不匹配, 将清除本地数据, 刷新页面后继续',
        tid: 'PASSWORD_SIGN_NOT_MATCH',
        type: 'error',
        duration: 0,
        closable: true,
        actions: (
          <Button
            size="tiny"
            onClick={async () => {
              await synckit.clearDatabase()
              window.location.href = '/'
            }}
          >
            刷新
          </Button>
        ),
      })
    })

    const init = async () => {
      try {
        try {
          await synckit.loadAppInfo()
        } catch (e) {
          throw e
        }

        try {
          const profile = await httpProfile()

          if (config.sign && profile.webDBPassSign !== config.sign) {
            EventBus.emit('SHOW_SIGN_ERROR')

            throw new Error('password sign not match')
          }

          await synckit.updateSign(profile.webDBPassSign)
          config.password = profile.webDBPass
          config.sign = profile.webDBPassSign
        } catch (e) {
          throw e
        }

        await synckit.loadNotes()
        await synckit.sync()
      } catch {}
    }

    init()
  }, [])

  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-col">
      <Header></Header>

      <Nav></Nav>

      <div className="flex flex-1">
        <Explorer></Explorer>

        {config.isMobile ? <BookModal></BookModal> : <BookArea></BookArea>}
      </div>

      <ContextMenu></ContextMenu>
      <Toast></Toast>
    </div>
  )
})
