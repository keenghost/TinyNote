import { config, type Unit } from '@src/common/store'
import CryptoJS from 'crypto-js'
import { Dexie, type EntityTable } from 'dexie'

function encrypt(inText: string) {
  return CryptoJS.AES.encrypt(inText, config.password).toString()
}

function decrypt(inText: string) {
  return CryptoJS.AES.decrypt(inText, config.password).toString(CryptoJS.enc.Utf8)
}

interface IAppInfo {
  id: number
  sign: string
  v: number
}

interface IUnitInTable {
  uid: number
  val: string
}

const _db = new Dexie('tinynote') as Dexie & {
  info: EntityTable<IAppInfo, 'id'>
  units: EntityTable<IUnitInTable, 'uid'>
}

_db.version(1).stores({
  info: 'id,sign,v',
  units: 'uid,val',
})

class DB {
  async perform(inData: {
    insertUnits?: Unit[]
    updateUnits?: Unit[]
    deleteUnits?: number[]
    sign?: string
    v?: number
  }) {
    const insertUnits = inData.insertUnits || []
    const updateUnits = inData.updateUnits || []
    const deleteUnits = inData.deleteUnits || []
    const sign = inData.sign
    const v = inData.v

    return _db.transaction('rw', _db.info, _db.units, async () => {
      if (insertUnits.length) {
        const unitsInTable = insertUnits.map(unit => {
          return {
            uid: unit.uid,
            val: encrypt(JSON.stringify(unit)),
          }
        })

        await _db.units.bulkPut(unitsInTable)
      }

      if (updateUnits.length) {
        for (const unit of updateUnits) {
          const val = encrypt(JSON.stringify(unit))

          await _db.units.update(unit.uid, { val: val })
        }
      }

      if (deleteUnits.length) {
        await _db.units.bulkDelete(deleteUnits)
      }

      if (sign) {
        await _db.info.update(1, { sign: sign })
      }

      if (v) {
        await _db.info.update(1, { v: v })
      }
    })
  }

  async initInfoTable(sign: string, v: number) {
    await _db.info.delete(1)

    return _db.info.add({ id: 1, sign: sign, v: v })
  }

  async getInfo() {
    return (await _db.info.toArray())[0]
  }

  async getAllUnits() {
    const unitsInTable = await _db.units.toArray()

    return unitsInTable.map(unitInTable => {
      return JSON.parse(decrypt(unitInTable.val)) as Unit
    })
  }

  async clear() {
    await _db.info.clear()
    await _db.units.clear()
  }
}

export const db = new DB()
