import { type Unit } from '@/common/store'
import { ENOTE_TYPE, EUNIT_TYPE } from '@/types/common'

type IProps = {
  className?: string
  onClick?: (inUnit: Pick<Unit, 'uid' | 'type' | 'name' | 'ntype'>) => void
  onContextMenu?: (e: React.MouseEvent<HTMLDivElement>) => void
} & Pick<Unit, 'uid' | 'type' | 'name' | 'ntype'>

export default (props: IProps) => {
  function onClick() {
    props.onClick?.({
      uid: props.uid,
      type: props.type,
      name: props.name,
      ntype: props.ntype,
    })
  }

  function onContextMenu(e: React.MouseEvent<HTMLDivElement>) {
    props.onContextMenu?.(e)

    return false
  }

  function getPngClass(inUnitType: EUNIT_TYPE, inNoteType: ENOTE_TYPE) {
    if (inUnitType === EUNIT_TYPE.FOLDER) {
      return 'png-folder'
    }

    if (inNoteType === ENOTE_TYPE.TXT) {
      return 'png-txt'
    }

    if (inNoteType === ENOTE_TYPE.MARKDOWN) {
      return 'png-md'
    }

    if (inNoteType === ENOTE_TYPE.KEYVALUE) {
      return 'png-keyvalue'
    }

    return ''
  }

  return (
    <div
      className={['flex h-48 select-none items-center', props.className].join(' ')}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <div
        className={[
          'ml-4 mr-4 h-28 w-28 bg-contain bg-center bg-no-repeat',
          getPngClass(props.type, props.ntype),
        ].join(' ')}
      ></div>
      <div className="flex-1 text-ellipsis whitespace-nowrap">{props.name}</div>
    </div>
  )
}
