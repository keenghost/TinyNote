import EventBus from '@src/common/event-bus'

class HistoryManager {
  #actionIds: string[] = []

  constructor() {
    EventBus.on('HISTORY_BACK', () => this.historyBack())
  }

  historyBack() {
    const actionId = this.#actionIds.pop() || ''
    EventBus.emit('BACK_ACTION', actionId)
  }

  addActionId(inActionId: string) {
    this.#actionIds.push(inActionId)
  }
}

export const historyManager = new HistoryManager()
