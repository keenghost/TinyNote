import { config, ENOTE_ERROR_TYPE, store } from '@src/common/store'
import BookPreviewModal from '@src/components/book-preview-modal'
import UnitView from '@src/components/unit-view'
import Button from '@src/ui-components/button'
import Modal from '@src/ui-components/modal'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { ENOTE_TYPE, EUNIT_TYPE } from 'srv/types'

interface IProps {
  type: 'warning' | 'error'
  title?: string
  visible: boolean
  onCancel?: () => void
}

export default observer<IProps>(props => {
  const [bookPreviewModalUid, setBookPreviewModalUid] = useState(0)
  const [bookPreviewModalType, setBookPreviewModalType] = useState<'mod' | 'new'>('mod')
  const units: {
    uid: number
    name: string
    ntype: ENOTE_TYPE
    eType: ENOTE_ERROR_TYPE | undefined
  }[] = []
  const uids = Array.from(store.modUnits.keys())

  if (props.type === 'warning') {
    for (const uid of uids) {
      const modUnit = store.modUnits.get(uid)
      const errUnit = store.errUnits.get(uid)

      if (modUnit) {
        units.push({
          uid,
          name: modUnit.name,
          ntype: modUnit.ntype,
          eType: errUnit?.etype,
        })
      }
    }
  }

  if (props.type === 'error') {
    for (const uid of uids) {
      const modUnit = store.modUnits.get(uid)
      const errUnit = store.errUnits.get(uid)

      if (errUnit) {
        units.push({
          uid,
          name: modUnit?.name || '',
          ntype: modUnit?.ntype || ENOTE_TYPE.MARKDOWN,
          eType: errUnit.etype,
        })
      }
    }
  }

  function abortUnit(inUid: number) {
    store.abortModUnit(inUid)
  }

  function onOpenNewClick(inUid: number) {
    setBookPreviewModalUid(inUid)
    setBookPreviewModalType('new')
  }

  function onOpenModClick(inUid: number) {
    setBookPreviewModalUid(inUid)
    setBookPreviewModalType('mod')
  }

  function getErrorText(inEtype?: ENOTE_ERROR_TYPE) {
    switch (inEtype) {
      case ENOTE_ERROR_TYPE.CONFLICT:
        return '有冲突'
      case ENOTE_ERROR_TYPE.DELETED:
        return '已删除'
      default:
        return '未保存'
    }
  }

  function getErrorClass(inEtype?: ENOTE_ERROR_TYPE) {
    switch (inEtype) {
      case ENOTE_ERROR_TYPE.CONFLICT:
        return 'bg-orange-300'
      case ENOTE_ERROR_TYPE.DELETED:
        return 'bg-red-300'
      default:
        return 'bg-sky-300'
    }
  }

  return (
    props.visible && (
      <Modal
        title={props.title}
        size={config.isMobile ? 'tiny' : 'medium'}
        onCancel={props.onCancel}
        onOk={props.onCancel}
        useNoOkButton={true}
        cancelButtonText="关闭"
      >
        <div className="h-[480px] overflow-y-auto">
          {units.map(u => {
            return (
              <div
                key={u.uid}
                className={[
                  'has-hover:hover:bg-slate-100',
                  config.isMobile ? '' : 'flex items-center',
                ].join(' ')}
              >
                <UnitView
                  uid={u.uid}
                  type={EUNIT_TYPE.BOOK}
                  name={u.name}
                  ntype={u.ntype}
                  className="flex-1"
                ></UnitView>
                <div className="mr-8 flex items-center gap-8">
                  <div
                    className={[
                      'rounded-3 bg- px-6 py-2 text-white',
                      getErrorClass(u.eType),
                    ].join(' ')}
                  >
                    {getErrorText(u.eType)}
                  </div>
                  <Button
                    size="tiny"
                    onClick={() => onOpenNewClick(u.uid)}
                  >
                    查看最新
                  </Button>
                  <Button
                    size="tiny"
                    onClick={() => onOpenModClick(u.uid)}
                  >
                    查看修改
                  </Button>
                  <Button
                    type="error"
                    size="tiny"
                    onClick={() => abortUnit(u.uid)}
                  >
                    放弃
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {!!bookPreviewModalUid && (
          <BookPreviewModal
            uid={bookPreviewModalUid}
            viewType={bookPreviewModalType}
            onCancel={() => setBookPreviewModalUid(0)}
          ></BookPreviewModal>
        )}
      </Modal>
    )
  )
})
