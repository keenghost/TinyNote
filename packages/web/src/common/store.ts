import { type IHttpError, httpList, httpModNotes } from '@src/common/api'
import { db } from '@src/common/db'
import EventBus from '@src/common/event-bus'
import { action, makeObservable, observable } from 'mobx'
import { EMOD_TYPE, ENOTE_TYPE, EUNIT_TYPE } from 'srv/types'

export const enum ENOTE_ERROR_TYPE {
  DELETED = 1,
  CONFLICT = 2,
}

export class Unit {
  uid = 0
  name = ''
  pid = 0
  type: EUNIT_TYPE = EUNIT_TYPE.FOLDER
  kids: number[] = []
  note = ''
  ntype = ENOTE_TYPE.MARKDOWN
  notev = 0
}

window.setInterval(async () => {
  store.updateTimeLeft(store.timeLeft - 1000)

  if (store.timeLeft <= 0) {
    store.updateTimeLeft(5 * 60 * 1000)

    synckit.sync()
  }
}, 1000)

class Config {
  v = 0
  sign = ''
  password = ''
  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

class Synckit {
  #prom: Promise<void> = Promise.resolve()

  constructor() {}

  get prom() {
    return this.#prom
  }

  async loadAppInfo() {
    const appInfo = await db.getInfo()

    if (!appInfo) {
      await db.initInfoTable('', 0)
    }

    const { v, sign } = await db.getInfo()

    config.v = v
    config.sign = sign
  }

  async loadNotes() {
    const units = await db.getAllUnits()
    store.initAll(units)
  }

  async updateSign(inSign: string) {
    await db.perform({
      sign: inSign,
    })
  }

  async clearDatabase() {
    await db.clear()
  }

  async delegateHttp<T>(inApiFunc: () => Promise<T>) {
    for (let i = 0; i < 3; i++) {
      await this.prom

      try {
        const result = await inApiFunc()
        this.sync()

        return result
      } catch (error) {
        const e = error as IHttpError

        if (e.status === 488) {
          this.sync()
        } else if (e.status === 489) {
          EventBus.emit('SHOW_SIGN_ERROR')
          throw e
        } else {
          throw e
        }
      }
    }
  }

  async save() {
    const uids = Array.from(store.modUnits.keys())
    const toModUnits: { uid: number; newNote: string; notev: number }[] = []

    for (const uid of uids) {
      const modUnit = store.modUnits.get(uid)

      if (!modUnit) {
        continue
      }

      const errUnit = store.errUnits.get(uid)

      if (errUnit) {
        continue
      }

      toModUnits.push({
        uid: uid,
        newNote: modUnit.note,
        notev: modUnit.notev,
      })
    }

    if (toModUnits.length > 0) {
      await this.delegateHttp(() =>
        httpModNotes({
          units: toModUnits,
        })
      )
    }
  }

  sync() {
    this.#prom = this.#sync()

    return this.#prom
  }

  async #sync() {
    store.updateTimeLeft(5 * 60 * 1000)

    try {
      const { v, units } = await httpList()

      const insertUnits: Unit[] = []
      const updateUnits: Unit[] = []
      const deleteUnits: number[] = []

      for (const item of units) {
        const { unit, mtype } = item
        const { uid, name, pid, type, kids, note, ntype, notev } = unit

        if (mtype === EMOD_TYPE.FULL) {
          const oldUnit = store.units.get(uid)

          const newUnit = new Unit()
          newUnit.uid = uid
          newUnit.name = name
          newUnit.pid = pid
          newUnit.type = type
          newUnit.kids = kids
          newUnit.note = note
          newUnit.ntype = ntype
          newUnit.notev = notev

          if (oldUnit) {
            updateUnits.push(newUnit)
          } else {
            insertUnits.push(newUnit)
          }
        } else if (mtype === EMOD_TYPE.DELE) {
          deleteUnits.push(uid)
        } else {
          const oldUnit = store.units.get(uid)

          const newUnit = new Unit()
          newUnit.uid = uid
          newUnit.name = name
          newUnit.pid = pid
          newUnit.type = type
          newUnit.kids = kids
          newUnit.note = oldUnit?.note || note
          newUnit.ntype = ntype
          newUnit.notev = notev

          if (oldUnit) {
            updateUnits.push(newUnit)
          } else {
            insertUnits.push(newUnit)
          }
        }
      }

      await db.perform({
        insertUnits: insertUnits,
        updateUnits: updateUnits,
        deleteUnits: deleteUnits,
        v: v,
      })

      store.insertUnits(insertUnits)
      store.updateUnits(updateUnits)
      store.deleteUnits(deleteUnits)
      config.v = v

      store.settleModUnits()

      EventBus.emit('TOAST', {
        msg: '拉取成功',
      })
    } catch (e) {
      EventBus.emit('TOAST', {
        msg: `拉取失败: ${(e as Error).message}`,
        type: 'error',
      })
    }
  }
}

class Store {
  @observable units: Map<number, Unit> = new Map()
  @observable modUnits: Map<
    number,
    { name: string; note: string; ntype: ENOTE_TYPE; notev: number; timer: number }
  > = new Map()
  @observable errUnits: Map<number, { etype: ENOTE_ERROR_TYPE }> = new Map()
  @observable folderId = 0
  @observable contentId = 0
  @observable navPath: Pick<Unit, 'uid' | 'name'>[] = []
  @observable chosenId = 0
  @observable timeLeft = 5 * 60 * 1000
  @observable columns = config.isMobile ? 1 : 2
  @observable columnWidth = config.isMobile ? document.body.clientWidth : 240

  constructor() {
    makeObservable(this)
  }

  @action
  insertUnits(inUnits: Unit[]) {
    for (const inUnit of inUnits) {
      this.units.set(inUnit.uid, inUnit)
    }
  }

  @action
  updateUnits(inUnits: Unit[]) {
    for (const inUnit of inUnits) {
      this.units.set(inUnit.uid, inUnit)
    }
  }

  @action
  deleteUnits(inIds: number[]) {
    for (const inId of inIds) {
      this.units.delete(inId)

      if (this.contentId === inId) {
        this.contentId = 0
      }
    }
  }

  @action
  initAll(inUnits: Unit[]) {
    for (const unit of inUnits) {
      this.units.set(unit.uid, unit)
    }

    this.navPath = [{ uid: 1, name: '/' }]
  }

  @action
  updateFolderId(inId: number) {
    if (inId === this.folderId) {
      return
    }

    const unit = this.units.get(inId)

    if (!unit) {
      return
    }

    const navPath: Pick<Unit, 'uid' | 'name'>[] = []
    navPath.unshift({ uid: unit.uid, name: unit.name })

    let parentId = unit.pid

    while (parentId) {
      const tempUnit = this.units.get(parentId)

      if (!tempUnit) {
        break
      }

      navPath.unshift({ uid: tempUnit.uid, name: tempUnit.name })

      parentId = tempUnit ? tempUnit.pid : 0
    }

    this.navPath = navPath
    this.folderId = unit.uid
  }

  @action
  updateContentId(inId: number) {
    this.contentId = inId
  }

  @action
  updateChosenId(inId: number) {
    this.chosenId = inId
  }

  getNote(inUid: number) {
    const modNote = this.modUnits.get(inUid)

    if (modNote) {
      return modNote.note
    }

    return this.units.get(inUid)?.note || ''
  }

  @action
  updateNote(inUid: number, inNote: string) {
    const modUnit = this.modUnits.get(inUid)
    const timer = window.setTimeout(() => this.settleModUnits([inUid]), 5000)

    if (modUnit) {
      window.clearTimeout(modUnit.timer)

      this.modUnits.set(inUid, {
        name: modUnit.name,
        note: inNote,
        ntype: modUnit.ntype,
        notev: modUnit.notev,
        timer: timer,
      })
    } else {
      const unit = this.units.get(inUid)

      this.modUnits.set(inUid, {
        name: unit?.name || '',
        note: inNote,
        ntype: unit?.ntype || ENOTE_TYPE.MARKDOWN,
        notev: unit?.notev || 0,
        timer: timer,
      })
    }
  }

  @action
  updateTimeLeft(inTimeLeft: number) {
    this.timeLeft = inTimeLeft
  }

  @action
  settleModUnits(inUids?: number[]) {
    const uids = inUids ? inUids : Array.from(this.modUnits.keys())

    for (const uid of uids) {
      const modUnit = this.modUnits.get(uid)

      if (!modUnit) {
        continue
      }

      const unit = this.units.get(uid)

      if (!unit) {
        this.errUnits.set(uid, { etype: ENOTE_ERROR_TYPE.DELETED })

        continue
      }

      if (unit.note === modUnit.note) {
        this.modUnits.delete(uid)
        this.errUnits.delete(uid)

        continue
      }

      if (unit.notev !== modUnit.notev) {
        this.errUnits.set(uid, { etype: ENOTE_ERROR_TYPE.CONFLICT })

        continue
      }
    }
  }

  @action
  abortModUnit(inUid: number) {
    this.modUnits.delete(inUid)
    this.errUnits.delete(inUid)
  }
}

export const config = new Config()
export const synckit = new Synckit()
export const store = new Store()
