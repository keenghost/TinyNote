import { httpCopy, httpMove } from '@src/common/api'
import EventBus from '@src/common/event-bus'
import { store, synckit, type Unit } from '@src/common/store'
import UnitView from '@src/components/unit-view'
import Button from '@src/ui-components/button'
import Modal from '@src/ui-components/modal'
import { useState } from 'react'
import { EUNIT_TYPE } from 'srv/types'

type IProps = {
  uid: number
  type: 'copy' | 'move'
  onCancel?: () => void
}

export default (props: IProps) => {
  const [nav, setNav] = useState<number[]>([1])

  const units: Unit[] = []

  for (const u of nav) {
    const unit = store.units.get(u)

    if (unit) {
      units.push(unit)
    }
  }

  const lastUnit = units[units.length - 1]
  const subUnits: Unit[] = []

  if (lastUnit) {
    const rawUnits: Unit[] = []

    for (const kid of lastUnit.kids) {
      const unit = store.units.get(kid)

      if (unit && unit.type === EUNIT_TYPE.FOLDER && unit.uid !== props.uid) {
        rawUnits.push(unit)
      }
    }

    subUnits.push(
      ...rawUnits.sort((u1, u2) => {
        return u1.name.localeCompare(u2.name)
      })
    )
  }

  async function onOk() {
    if (props.type === 'copy') {
      try {
        await synckit.delegateHttp(() =>
          httpCopy({ uid: props.uid, newPid: nav[nav.length - 1] })
        )

        EventBus.emit('TOAST', {
          msg: '复制成功',
          type: 'success',
        })

        onCancel()
      } catch (e) {
        EventBus.emit('TOAST', {
          msg: `复制失败: ${(e as Error).message}`,
          type: 'error',
        })
      }
    } else if (props.type === 'move') {
      try {
        await synckit.delegateHttp(() =>
          httpMove({ uid: props.uid, newPid: nav[nav.length - 1] })
        )

        EventBus.emit('TOAST', {
          msg: '移动成功',
          type: 'success',
        })

        onCancel()
      } catch (e) {
        EventBus.emit('TOAST', {
          msg: `移动失败: ${(e as Error).message}`,
          type: 'error',
        })
      }
    }
  }

  function onCancel() {
    props.onCancel?.()
  }

  return (
    <Modal
      title={props.type === 'copy' ? '复制到' : '移动到'}
      size="tiny"
      onOk={onOk}
      onCancel={onCancel}
      useLoading={true}
    >
      <div className="">
        <div className="mb-4 flex items-center justify-center">
          <div className="png-folder mr-8 h-28 w-28 bg-contain bg-center bg-no-repeat"></div>
          <div className="max-w-[226px] text-ellipsis whitespace-nowrap">{lastUnit?.name}</div>
        </div>
        <div className="h-[480px] overflow-y-auto bg-slate-50">
          {subUnits.length === 0 ? (
            <div className="flex h-full w-full items-center justify-center">
              <Button
                size="tiny"
                onClick={() => setNav([...nav.slice(0, nav.length - 1)])}
              >
                返回上层
              </Button>
            </div>
          ) : (
            subUnits.map(unit => (
              <UnitView
                key={unit.uid}
                className="has-hover:hover:bg-gray-100 flex h-48 cursor-default select-none p-8"
                onClick={() => setNav([...nav, unit.uid])}
                uid={unit.uid}
                name={unit.name}
                type={unit.type}
                ntype={unit.ntype}
              ></UnitView>
            ))
          )}
        </div>
        <div className="has-hover:overflow-x-scroll no-hover:overflow-x-auto flex items-center whitespace-nowrap">
          {units.map((unit, index) => (
            <div
              key={unit.uid}
              className="flex shrink-0 items-center"
            >
              <Button
                size="tiny"
                type="transparent"
                disabled={index === units.length - 1}
                onClick={() => setNav([...nav.slice(0, index + 1)])}
              >
                {unit.name}
              </Button>
              <div className="png-arrow h-12 w-12 bg-contain bg-center bg-no-repeat"></div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}
