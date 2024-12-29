import { type Database as BetterSqlite3Database } from 'better-sqlite3'

export enum ETableFieldType {
  INTEGER = 'INTEGER',
  REAL = 'REAL',
  TEXT = 'TEXT',
}

export type ITableField = {
  fieldName: string
  fieldType: ETableFieldType
  autoIncrement?: boolean
  defaultValue?: string
  notNull?: boolean
  primaryKey?: boolean
}

export type ITableDefine = {
  tableName: string
  tableFields: ITableField[]
}

function GenerateOneColumnDescription(inTableField: ITableField) {
  const columnProperties: string[] = []

  columnProperties.push(inTableField.fieldName)
  columnProperties.push(inTableField.fieldType)

  if (inTableField.primaryKey) {
    columnProperties.push('PRIMARY KEY')
  }

  if (inTableField.defaultValue) {
    columnProperties.push(`DEFAULT ${inTableField.defaultValue}`)
  }

  if (inTableField.autoIncrement) {
    columnProperties.push('AUTOINCREMENT')
  }

  if (inTableField.notNull) {
    columnProperties.push('NOT NULL')
  }

  return columnProperties.join(' ')
}

function GenerateCreateColumnsDescription(inTableFields: ITableField[]) {
  const columns: string[] = []

  // id INTEGER PRIMARY KEY DEFAULT 0 NOT NULL
  for (const tableField of inTableFields) {
    columns.push(GenerateOneColumnDescription(tableField))
  }

  return columns.join(',')
}

function checkTableDefine(inTableDefine: ITableDefine) {
  let seenPrimaryKey = false

  for (const field of inTableDefine.tableFields) {
    if (field.primaryKey) {
      if (seenPrimaryKey) {
        throw new Error('should not over 1 primary key')
      }

      seenPrimaryKey = true
    }
  }
}

export function checkDB(inDB: BetterSqlite3Database, inTableDefines: ITableDefine[]) {
  const statement = inDB.prepare(`SELECT name FROM sqlite_master WHERE type='table'`)
  const tableNames = (statement.all() as { name: string }[]).map(_ => _.name)

  for (const tableDefine of inTableDefines) {
    checkTableDefine(tableDefine)

    if (tableNames.includes(tableDefine.tableName)) {
      // cid: 0, name: 'Id', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0
      const oldColumns = inDB.pragma(`table_info(${tableDefine.tableName})`) as {
        cid: number
        name: string
        type: string
        notnull: number
        dlft_value: null | number | string
        pk: number
      }[]

      for (const field of tableDefine.tableFields) {
        if (!oldColumns.find(_ => _.name === field.fieldName)) {
          inDB
            .prepare(
              `ALTER TABLE ${tableDefine.tableName} ADD COLUMN ${GenerateOneColumnDescription(field)}`
            )
            .run()
        }
      }
    } else {
      inDB
        .prepare(
          `CREATE TABLE ${tableDefine.tableName}(${GenerateCreateColumnsDescription(tableDefine.tableFields)})`
        )
        .run()
    }
  }
}
