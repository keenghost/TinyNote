import { httpLogout } from '@src/common/api'
import EventBus from '@src/common/event-bus'
import { store, synckit } from '@src/common/store'
import AboutModal from '@src/components/about-modal'
import ChangeListModal from '@src/components/change-list-modal'
import SettingsModal from '@src/components/settings-modal'
import Button from '@src/ui-components/button'
import PngButton from '@src/ui-components/png-button'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'

export default observer(() => {
  const [warningModalVisible, setWarningModalVisible] = useState(false)
  const [errorModalVisible, setErrorModalVisible] = useState(false)
  const [aboutModalVisible, setAboutModalVisible] = useState(false)
  const [settingsModalVisible, setSettingsModalVisible] = useState(false)

  function ms2mmss(ms: number) {
    const seconds = Math.floor(ms / 1000) % 60
    const minutes = Math.floor(ms / 1000 / 60)

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  async function onFetchClick() {
    return synckit.sync()
  }

  async function onSaveClick() {
    try {
      await synckit.save()

      EventBus.emit('TOAST', {
        msg: '保存成功',
        type: 'success',
      })
    } catch (e) {
      EventBus.emit('TOAST', {
        msg: `保存失败: ${(e as Error).message}`,
        type: 'error',
      })
    }
  }

  function openOptionsMenu(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    EventBus.emit('SHOW_MENU', {
      menus: [
        {
          item: '设置',
          callback: () => {
            setSettingsModalVisible(true)
          },
        },
        {
          item: '关于',
          callback: () => {
            setAboutModalVisible(true)
          },
        },
        {
          item: '退出',
          callback: async () => {
            await httpLogout()
            window.location.href = '/login'
          },
        },
      ],
      extra: {
        useElement: {
          element: e.currentTarget,
          direction: 'BR',
          offset: { right: 3 },
        },
      },
    })
  }

  return (
    <div className="flex h-48 items-center justify-between pl-4 pr-4 shadow-[0_4px_8px_rgba(0,0,0,0.03)]">
      <div
        className="flow-bg text-20 bg-clip-text font-bold leading-[1.3] text-transparent"
        style={{ fontFamily: 'logo' }}
      >
        TINY NOTE
      </div>

      <div className="flex items-center">
        <div className="mr-8">{ms2mmss(store.timeLeft)}</div>

        <div className="flex items-center">
          <Button
            size="tiny"
            type="default"
            className="mr-4"
            useLoading={true}
            onClick={onFetchClick}
          >
            拉取
          </Button>

          <Button
            size="tiny-wide"
            type={store.modUnits.size > 0 ? 'warning' : 'success'}
            className="mr-4"
            onClick={() => setWarningModalVisible(true)}
          >
            {store.modUnits.size}
          </Button>

          <Button
            size="tiny-wide"
            type={store.errUnits.size > 0 ? 'error' : 'success'}
            className="mr-4"
            onClick={() => setErrorModalVisible(true)}
          >
            {store.errUnits.size}
          </Button>

          <Button
            size="tiny"
            type="primary"
            className="mr-4"
            useLoading={true}
            onClick={onSaveClick}
            disabled={store.modUnits.size === store.errUnits.size}
          >
            保存
          </Button>

          <PngButton
            pngClass="png-options"
            size="tiny"
            onClick={e => openOptionsMenu(e)}
          ></PngButton>
        </div>
      </div>

      {warningModalVisible && (
        <ChangeListModal
          type="warning"
          title={`修改列表 (${store.modUnits.size})`}
          visible={warningModalVisible}
          onCancel={() => setWarningModalVisible(false)}
        ></ChangeListModal>
      )}

      {errorModalVisible && (
        <ChangeListModal
          type="error"
          title={`冲突列表 (${store.errUnits.size})`}
          visible={errorModalVisible}
          onCancel={() => setErrorModalVisible(false)}
        ></ChangeListModal>
      )}

      {aboutModalVisible && (
        <AboutModal
          visible={aboutModalVisible}
          onCancel={() => setAboutModalVisible(false)}
        ></AboutModal>
      )}

      {settingsModalVisible && (
        <SettingsModal
          visible={settingsModalVisible}
          onCancel={() => setSettingsModalVisible(false)}
        ></SettingsModal>
      )}
    </div>
  )
})
