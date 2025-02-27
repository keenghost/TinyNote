import BetterSqlite3, { Database as BetterSqlite3Database } from 'better-sqlite3'
import path from 'node:path'
import { checkDB, ETableFieldType, type ITableDefine } from '../common/dbutils.js'
import { type IUnit } from '../types/common.js'
import { EMOD_TYPE, ENOTE_TYPE, EUNIT_TYPE } from '../types/enum.js'

export type IUnitInTable = Omit<IUnit, 'kids'> & {
  kids: string
}

const TABLE_DEFINES: ITableDefine[] = [
  {
    tableName: 'units',
    tableFields: [
      {
        fieldName: 'uid',
        fieldType: ETableFieldType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      {
        fieldName: 'type',
        fieldType: ETableFieldType.INTEGER,
        defaultValue: '1',
        notNull: true,
      },
      {
        fieldName: 'name',
        fieldType: ETableFieldType.TEXT,
        defaultValue: '',
        notNull: true,
      },
      {
        fieldName: 'pid',
        fieldType: ETableFieldType.INTEGER,
        defaultValue: '1',
        notNull: true,
      },
      {
        fieldName: 'kids',
        fieldType: ETableFieldType.TEXT,
        defaultValue: '[]',
        notNull: true,
      },
      {
        fieldName: 'note',
        fieldType: ETableFieldType.TEXT,
        defaultValue: '',
        notNull: true,
      },
      {
        fieldName: 'ntype',
        fieldType: ETableFieldType.INTEGER,
        defaultValue: '1',
        notNull: true,
      },
      {
        fieldName: 'notev',
        fieldType: ETableFieldType.INTEGER,
        defaultValue: '0',
        notNull: true,
      },
    ],
  },
  {
    tableName: 'logs',
    tableFields: [
      {
        fieldName: 'v',
        fieldType: ETableFieldType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      {
        fieldName: 'uids',
        fieldType: ETableFieldType.TEXT,
        notNull: true,
      },
    ],
  },
]

class Database {
  #db: BetterSqlite3Database

  constructor() {
    this.#db = new BetterSqlite3(path.resolve('runtime/tinynote.db'), {
      fileMustExist: false,
    })

    this.#db.pragma('journal_mode = DELETE')

    checkDB(this.#db, TABLE_DEFINES)

    const root = this.#db
      .prepare<number, { uid: number }>('SELECT * FROM units WHERE uid = ?')
      .get(1)

    if (!root) {
      const transaction = this.#db.transaction(() => {
        this.#db
          .prepare(
            'INSERT INTO units (type, name, pid, kids, note, ntype, notev) VALUES (?, ?, ?, ?, ?, ?, ?)'
          )
          .run(EUNIT_TYPE.FOLDER, '/', 0, '[]', '', ENOTE_TYPE.MARKDOWN, 0)

        this.#db
          .prepare('INSERT INTO logs (uids) VALUES (?)')
          .run(JSON.stringify([{ uid: 1, mtype: EMOD_TYPE.FULL }]))
      })

      transaction()
    }
  }

  add(inUnit: { type: EUNIT_TYPE; name: string; pid: number; ntype: ENOTE_TYPE }) {
    const { type, name, pid, ntype } = inUnit

    const getParentStatement = this.#db.prepare<any, IUnitInTable>(
      'SELECT * FROM units WHERE uid = ?'
    )
    const parent = getParentStatement.get(pid)

    if (!parent) {
      throw new Error('Parent not found')
    }

    const kids = JSON.parse(parent.kids)

    const transaction = this.#db.transaction(() => {
      const result = this.#db
        .prepare(
          'INSERT INTO units (type, name, pid, kids, note, ntype, notev) VALUES (?, ?, ?, ?, ?, ?, ?)'
        )
        .run(type, name, pid, '[]', '', ntype, 0)

      const lastUid = result.lastInsertRowid
      kids.push(lastUid)

      this.#db.prepare('UPDATE units SET kids = ? WHERE uid = ?').run(JSON.stringify(kids), pid)

      this.#db.prepare('INSERT INTO logs (uids) VALUES (?)').run(
        JSON.stringify([
          {
            uid: pid,
            mtype: EMOD_TYPE.INFO,
          },
          {
            uid: lastUid,
            mtype: EMOD_TYPE.FULL,
          },
        ])
      )
    })

    transaction()
  }

  modName(inUid: number, inName: string) {
    const transaction = this.#db.transaction(() => {
      this.#db.prepare('UPDATE units SET name = ? WHERE uid = ?').run(inName, inUid)

      this.#db
        .prepare('INSERT INTO logs (uids) VALUES (?)')
        .run(JSON.stringify([{ uid: inUid, mtype: EMOD_TYPE.INFO }]))
    })

    transaction()
  }

  modNotes(inUnits: { uid: number; newNote: string; notev: number }[]) {
    const newUnits: { uid: number; newNote: string; newNotev: number }[] = []

    for (const u of inUnits) {
      const unit = this.#db
        .prepare<any, IUnitInTable>('SELECT notev FROM units WHERE uid = ?')
        .get(u.uid)

      if (!unit) {
        throw new Error('Unit not found')
      }

      if (unit.notev !== u.notev) {
        throw new Error('notev not match')
      }

      newUnits.push({
        uid: u.uid,
        newNote: u.newNote,
        newNotev: unit.notev + 1,
      })
    }

    const transaction = this.#db.transaction(() => {
      for (const u of newUnits) {
        this.#db
          .prepare('UPDATE units SET note = ?, notev = ? WHERE uid = ?')
          .run(u.newNote, u.newNotev, u.uid)
      }

      this.#db
        .prepare('INSERT INTO logs (uids) VALUES (?)')
        .run(JSON.stringify(newUnits.map(u => ({ uid: u.uid, mtype: EMOD_TYPE.FULL }))))
    })

    transaction()
  }

  modPid(inUid: number, inPid: number) {
    const getUnitStatement = this.#db.prepare<any, IUnitInTable>(
      'SELECT * FROM units WHERE uid = ?'
    )
    const unit = getUnitStatement.get(inUid)

    if (!unit) {
      throw new Error('Unit not found')
    }

    const getOldParentStatement = this.#db.prepare<any, IUnitInTable>(
      'SELECT * FROM units WHERE uid = ?'
    )
    const oldParent = getOldParentStatement.get(unit.pid)

    if (!oldParent) {
      throw new Error('oldParent not found')
    }

    const oldKids = JSON.parse(oldParent.kids) as number[]

    const getNewParentStatement = this.#db.prepare<any, IUnitInTable>(
      'SELECT * FROM units WHERE uid = ?'
    )
    const newParent = getNewParentStatement.get(inPid)

    if (!newParent) {
      throw new Error('newParent not found')
    }

    const newKids = JSON.parse(newParent.kids)

    const transaction = this.#db.transaction(() => {
      this.#db.prepare('UPDATE units SET pid = ? WHERE uid = ?').run(inPid, inUid)

      this.#db
        .prepare('UPDATE units SET kids = ? WHERE uid = ?')
        .run(JSON.stringify(oldKids.filter(uid => uid !== inUid)), unit.pid)

      this.#db
        .prepare('UPDATE units SET kids = ? WHERE uid = ?')
        .run(JSON.stringify([...newKids, inUid]), inPid)

      this.#db.prepare('INSERT INTO logs (uids) VALUES (?)').run(
        JSON.stringify([
          {
            uid: inUid,
            mtype: EMOD_TYPE.INFO,
          },
          {
            uid: unit.pid,
            mtype: EMOD_TYPE.INFO,
          },
          {
            uid: inPid,
            mtype: EMOD_TYPE.INFO,
          },
        ])
      )
    })

    transaction()
  }

  copy(inUid: number, inPid: number) {
    const transaction = this.#db.transaction(() => {
      const logs: { uid: number; mtype: EMOD_TYPE }[] = [
        {
          uid: inPid,
          mtype: EMOD_TYPE.INFO,
        },
      ]

      this.#recursiveCopyAndNewUnit(inUid, inPid, logs)

      this.#db.prepare('INSERT INTO logs (uids) VALUES (?)').run(JSON.stringify(logs))
    })

    transaction()
  }

  #recursiveCopyAndNewUnit(
    inUid: number,
    inNewPid: number,
    inLogs: { uid: number; mtype: EMOD_TYPE }[]
  ) {
    const unit = this.#db
      .prepare<any, IUnitInTable>('SELECT * FROM units WHERE uid = ?')
      .get(inUid)

    if (!unit) {
      throw new Error('Unit not found')
    }

    const kids = JSON.parse(unit.kids) as number[]

    const newParent = this.#db
      .prepare<any, IUnitInTable>('SELECT * FROM units WHERE uid = ?')
      .get(inNewPid)

    if (!newParent) {
      throw new Error('newParent not found')
    }

    const newParentKids = JSON.parse(newParent.kids) as number[]

    const result = this.#db
      .prepare(
        'INSERT INTO units (type, name, pid, kids, note, ntype, notev) VALUES (?, ?, ?, ?, ?, ?, ?)'
      )
      .run(unit.type, unit.name, inNewPid, '[]', unit.note, unit.ntype, unit.notev)

    const newUid = result.lastInsertRowid as number

    this.#db
      .prepare('UPDATE units SET kids = ? WHERE uid = ?')
      .run(JSON.stringify([...newParentKids, newUid]), inNewPid)

    inLogs.push({
      uid: newUid,
      mtype: EMOD_TYPE.FULL,
    })

    for (const kid of kids) {
      this.#recursiveCopyAndNewUnit(kid, newUid, inLogs)
    }
  }

  del(inUid: number) {
    const getStatement = this.#db.prepare<any, IUnitInTable>(
      'SELECT pid FROM units WHERE uid = ?'
    )
    const unit = getStatement.get(inUid)

    if (!unit) {
      throw new Error('Unit not found')
    }

    const getParentStatement = this.#db.prepare<any, IUnitInTable>(
      'SELECT kids FROM units WHERE uid = ?'
    )
    const parent = getParentStatement.get(unit.pid)

    if (!parent) {
      throw new Error('Parent not found')
    }

    const pKids = JSON.parse(parent.kids) as number[]

    const pid = unit.pid
    const kids: number[] = []

    this.#recursiveGetKids(inUid, kids)

    kids.push(inUid)

    const logs = kids.map(uid => ({ uid, mtype: EMOD_TYPE.DELE }))
    logs.push({ uid: pid, mtype: EMOD_TYPE.INFO })

    const transaction = this.#db.transaction(() => {
      for (const kid of kids) {
        this.#db.prepare('DELETE FROM units WHERE uid = ?').run(kid)
      }

      this.#db
        .prepare('UPDATE units SET kids = ? WHERE uid = ?')
        .run(JSON.stringify(pKids.filter(uid => uid !== inUid)), pid)

      this.#db
        .prepare('INSERT INTO logs (uids) VALUES (?)')
        .run(JSON.stringify(kids.map(uid => ({ uid, mtype: EMOD_TYPE.DELE }))))
    })

    transaction()
  }

  #recursiveGetKids(inUid: number, inResult: number[]) {
    const getStatement = this.#db.prepare<any, IUnitInTable>(
      'SELECT kids FROM units WHERE uid = ?'
    )
    const unit = getStatement.get(inUid)

    if (!unit) {
      throw new Error('Unit not found')
    }

    const kids = JSON.parse(unit.kids)

    for (const kid of kids) {
      inResult.push(kid)
      this.#recursiveGetKids(kid, inResult)
    }
  }

  getNewest(inV: number) {
    const { v } = this.#db.prepare('SELECT MAX(v) AS v FROM logs').get() as { v: number }

    const uids = this.#db
      .prepare<number, { uids: string }>('SELECT uids FROM logs WHERE v > ?')
      .all(inV)
      .map(_ => JSON.parse(_.uids) as { uid: number; mtype: EMOD_TYPE })
      .flat()

    const shrinkedUids: { uid: number; mtype: EMOD_TYPE }[] = []

    for (const { uid, mtype } of uids) {
      const item = shrinkedUids.find(_ => _.uid === uid)

      if (item) {
        if (item.mtype === EMOD_TYPE.DELE) {
          continue
        } else if (item.mtype === EMOD_TYPE.INFO) {
          item.mtype = mtype
        } else {
          if (mtype === EMOD_TYPE.DELE) {
            item.mtype = mtype
          }
        }
      } else {
        shrinkedUids.push({ uid, mtype })
      }
    }

    const units: { unit: IUnit; mtype: EMOD_TYPE }[] = []

    for (const { uid, mtype } of shrinkedUids) {
      if (mtype === EMOD_TYPE.DELE) {
        units.push({
          unit: {
            uid,
            type: EUNIT_TYPE.FOLDER,
            name: '',
            pid: 0,
            kids: [],
            note: '',
            ntype: ENOTE_TYPE.MARKDOWN,
            notev: 0,
          },
          mtype,
        })
      } else if (mtype === EMOD_TYPE.INFO) {
        const unit = this.#db
          .prepare<
            number,
            IUnitInTable
          >('SELECT uid,type,name,pid,kids,ntype,notev FROM units WHERE uid = ?')
          .get(uid)

        if (!unit) {
          throw new Error('Unit not found')
        }

        units.push({
          unit: {
            ...unit,
            note: '',
            kids: JSON.parse(unit.kids),
          },
          mtype,
        })
      } else {
        const unit = this.#db
          .prepare<number, IUnitInTable>('SELECT * FROM units WHERE uid = ?')
          .get(uid)

        if (!unit) {
          throw new Error('Unit not found')
        }

        units.push({
          unit: {
            ...unit,
            kids: JSON.parse(unit.kids),
          },
          mtype,
        })
      }
    }

    return {
      v,
      units,
    }
  }

  getV() {
    const { v } = this.#db.prepare('SELECT MAX(v) AS v FROM logs').get() as { v: number }

    return v
  }
}

export const db = new Database()
