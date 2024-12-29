import { type IContextMenu } from '@/ui-components/context-menu'
import { type IToastMessage } from '@/ui-components/toast'
import Mitt, { type Emitter } from 'mitt'

type MyEventTypes = {
  SHOW_MENU: IContextMenu
  HISTORY_BACK: void
  BACK_ACTION: string
  TOGGLE_EDITOR_MODE: void
  TOAST: IToastMessage
  SHOW_SIGN_ERROR: void
}

const emitter: Emitter<MyEventTypes> = Mitt<MyEventTypes>()

export default emitter
