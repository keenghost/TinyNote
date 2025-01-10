import EventBus from '@src/common/event-bus'
import { config, store, type Unit as UnitClass } from '@src/common/store'
import ColumnOptimize from '@src/components/column-optimize'
import CopyMoveModal from '@src/components/copy-move-modal'
import DelModal from '@src/components/del-modal'
import ModNameModal from '@src/components/mod-name-modal'
import UnitView from '@src/components/unit-view'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { EUNIT_TYPE } from 'srv/types'

type IProps = {
  uid: number
}

export default observer<IProps>(props => {
  const [menuShowId, setMenuShowId] = useState(0)
  const [copyMoveModalType, setCopyMoveModalType] = useState<'copy' | 'move'>('copy')
  const [copyMoveModalVisible, setCopyMoveModalVisible] = useState(false)
  const [delModalVisible, setDelModalVisible] = useState(false)
  const [modNameModalVisible, setModNameModalVisible] = useState(false)
  const [modalActionUid, setModalActionUid] = useState(0)

  const units: UnitClass[] = []
  const unit = store.units.get(props.uid)

  if (unit && unit.type === EUNIT_TYPE.FOLDER) {
    const rawFolderUnits: UnitClass[] = []
    const rawBookUnits: UnitClass[] = []

    for (const kidId of unit.kids) {
      const kid = store.units.get(kidId)

      if (kid) {
        if (kid.type === EUNIT_TYPE.FOLDER) {
          rawFolderUnits.push(kid)
        } else {
          rawBookUnits.push(kid)
        }
      }
    }

    units.push(
      ...rawFolderUnits.sort((u1, u2) => {
        return u1.name.localeCompare(u2.name)
      }),
      ...rawBookUnits.sort((u1, u2) => {
        return u1.name.localeCompare(u2.name)
      })
    )
  }

  function onClick(inUnit: Pick<UnitClass, 'uid' | 'type' | 'pid'>) {
    store.updateChosenId(inUnit.uid)

    if (inUnit.type === EUNIT_TYPE.FOLDER) {
      store.updateFolderId(inUnit.uid)
    } else {
      store.updateFolderId(inUnit.pid)
      store.updateContentId(inUnit.uid)
    }
  }

  function onContextMenu(e: React.MouseEvent<HTMLDivElement>, inUid: number) {
    EventBus.emit('SHOW_MENU', {
      event: e,
      menus: [
        {
          callback: () => {
            setModalActionUid(inUid)
            setCopyMoveModalType('copy')
            setCopyMoveModalVisible(true)
          },
          item: <div>复制到</div>,
        },
        {
          callback: () => {
            setModalActionUid(inUid)
            setCopyMoveModalType('move')
            setCopyMoveModalVisible(true)
          },
          item: <div>移动到</div>,
        },
        {
          callback: () => {
            setModalActionUid(inUid)
            setModNameModalVisible(true)
          },
          item: <div>重命名</div>,
        },
        {
          callback: () => {
            setModalActionUid(inUid)
            setDelModalVisible(true)
          },
          item: <div>删除</div>,
        },
      ],
      onEnter: () => {
        setMenuShowId(inUid)
      },
      onCancel: () => {
        setMenuShowId(0)
      },
    })
  }

  function getUnitViewClasses(inUid: number) {
    const classes: string[] = []

    if (inUid === menuShowId) {
      classes.push('bg-[rgba(255,228,196,0.3)]')
    } else if (store.chosenId === inUid && !config.isMobile) {
      classes.push('bg-[rgba(35,119,203,0.3)]')
    } else {
      classes.push('has-hover:hover:bg-[rgba(35,119,203,0.05)]')
    }

    return classes.join(' ')
  }

  return (
    <div
      className="relative flex flex-col border-r border-gray-200"
      style={{ flex: `0 0 ${store.columnWidth}px` }}
    >
      {units.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-gray-400">空</div>
      ) : (
        <div className="flex-1 flex-col overflow-y-auto first-line:flex">
          {units.map(u => {
            return (
              <UnitView
                key={u.uid}
                uid={u.uid}
                name={u.name}
                type={u.type}
                ntype={u.ntype}
                className={[
                  'flex h-48 select-none items-center',
                  getUnitViewClasses(u.uid),
                ].join(' ')}
                onClick={() => onClick(u)}
                onContextMenu={e => onContextMenu(e, u.uid)}
              ></UnitView>
            )
          })}
        </div>
      )}

      <ColumnOptimize uid={props.uid}></ColumnOptimize>

      {copyMoveModalVisible && (
        <CopyMoveModal
          uid={modalActionUid}
          type={copyMoveModalType}
          onCancel={() => setCopyMoveModalVisible(false)}
        ></CopyMoveModal>
      )}

      {delModalVisible && (
        <DelModal
          uid={modalActionUid}
          onCancel={() => setDelModalVisible(false)}
        ></DelModal>
      )}

      {modNameModalVisible && (
        <ModNameModal
          uid={modalActionUid}
          onCancel={() => setModNameModalVisible(false)}
        ></ModNameModal>
      )}
    </div>
  )
})
