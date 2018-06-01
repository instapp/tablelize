/*!
 * Created by Acathur on Wed May 30 2018
 * Copyright (c) 2018 Instapp
 */

import TableStore from 'tablestore'
import Tablelize from '.'
import { CreateTableOptions, FindOptions } from './interfaces'
import Schema from './Schema'
import Table from './Table'
import logger from './utils/logger'
import rowToJSONData from './utils/rowToJSONData'
import { conditionNumberCheck, processFilter} from './utils/filterTools'
import processTableOptions from './utils/processTableOptions'
import TablelizeError from './utils/TablelizeError';
// import TablelizeError from './utils/TablelizeError'

const Long = TableStore.Long

class Model {

	public name: string
	public schema: Schema

	protected table: Table
	protected instance: Tablelize

	constructor(name: string, schema: any, instance: Tablelize) {
		if (!(schema instanceof Schema)) {
			schema = new Schema(schema)
		}

		this.name = name
		this.schema = schema
		this.instance = instance
		this.table = new Table(this.name, this.schema, this.instance)
	}

	/*
		Table
			- init (create or update)
			- drop

			- table.create
			- table.update
			- table.delete
			- table.describe
	*/

	private setDateGetter(response: any, isArray = false) {
		const columnMap = this.schema.columnMap

		// array
		if (isArray || Array.isArray(response.rows)) {
			Object.defineProperty(response, 'data', {
				get() {
					/// @ts-ignore
					return this.rows.map((item) => rowToJSONData(item, columnMap))
				}
			})
		} else {
			// object
			Object.defineProperty(response, 'data', {
				get() {
					/// @ts-ignore
					return rowToJSONData(this.row, columnMap)
				}
			})
		}
	}

	// init
	async init(opts: CreateTableOptions | any) {
		processTableOptions(opts)

		// check table list
		const tables: any = await this.instance.listTable()

		if (!tables.includes(this.name)) {
			// create table
			return await this.table.create(opts)
		} else {
			// update table
			const desc = await this.table.describe()

			if ((opts.reservedThroughput.capacityUnit.read && opts.reservedThroughput.capacityUnit.read !== desc.reservedThroughput.capacityUnit.read) ||
				(opts.reservedThroughput.capacityUnit.write && opts.reservedThroughput.capacityUnit.write !== desc.reservedThroughput.capacityUnit.write) ||
				opts.tableOptions.timeToLive !== desc.tableOptions.timeToLive ||
				opts.tableOptions.maxVersions !== desc.tableOptions.maxVersions
			) {
				return await this.table.update(opts)
			}
		}

		return true
	}

	// drop (deleteTable)
	async drop() {
		return await this.table.delete()
	}

	/*
		Row
			- insert
			- findOne
			- find
			- update
			- delete
	*/

    // insert (PutRow)
    async insert(row: any, opts?: any) {
		const params: any = {
			tableName: this.name,
			condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
			primaryKey: [],
			attributeColumns: [],
			returnContent: {
				returnType: TableStore.ReturnType.Primarykey
			}
		}

		for (const col of this.schema.columns) {
			let item: any = {}
			let value: any = row[col.name]

			if (!value && col.defaultValue) {
				switch (typeof col.defaultValue) {
					case 'string':
						value = col.defaultValue
						break

					case 'function':
						value = col.defaultValue()
						break

					default:
						break
				}
			}

			// number -> long
			if (value && col.type === Tablelize.INTEGER) {
				value = Long.fromNumber(value)
			}

			if (col.autoIncrement) {
				item[col.name] = TableStore.PK_AUTO_INCR
				params.primaryKey.push(item)
			} else if (col.primaryKey) {
				item[col.name] = value
				params.primaryKey.push(item)
			} else {
				item[col.name] = value
				params.attributeColumns.push(item)
			}
		}

		const res = await this.instance.client.putRow(params)

		this.setDateGetter(res)

		return res
    }

    // findOne (GetRow)
    async findOne(query: any, opts?: any) {
		const params: any = {
			tableName: this.name,
			primaryKey: []
		}
		const condNum = conditionNumberCheck(query, this.schema.columnMap)

		for (const col of this.schema.columns) {
			let item: any = {}
			let value: any = query[col.name]

			if (col.primaryKey) {
				if (typeof value === 'undefined' || value === null) {
					throw new TablelizeError(`All the primary keys must be to define in the find query.'`)
				} else if (typeof value === 'object') {
				} else {
					item[col.name] = (col.type === Tablelize.INTEGER) ? Long.fromNumber(value) : value
					params.primaryKey.push(item)
				}
			} else {
				processFilter(params, condNum, col, value)
			}
		}

		const res = await this.instance.client.getRow(params)

		this.setDateGetter(res)

		return res
    }

    // find (GetRange)
	async find(query: any, opts?: FindOptions) {
		query = query || {}
		opts = opts || {}
		opts.direction = opts.direction || TableStore.Direction.FORWARD

		let params: any

		if (query.tableName && query.inclusiveStartPrimaryKey && query.exclusiveEndPrimaryKey) {
			params = query
		} else {
			params = {
				tableName: this.name,
				direction: opts.direction,
				inclusiveStartPrimaryKey: [],
				exclusiveEndPrimaryKey: []
			}
			const condNum = conditionNumberCheck(query, this.schema.columnMap)

			if (opts.limit) {
				params.limit = opts.limit
			}

			for (const col of this.schema.columns) {
				let itemStart: any = {}
				let itemEnd: any = {}
				let value: any = query[col.name]

				if (col.primaryKey) {
					const isInteger = col.type === Tablelize.INTEGER

					if (typeof value === 'undefined' || value === null) {
						itemStart[col.name] = (opts.direction === TableStore.Direction.FORWARD) ? TableStore.INF_MIN : TableStore.INF_MAX
						itemEnd[col.name] = (opts.direction === TableStore.Direction.FORWARD) ? TableStore.INF_MAX : TableStore.INF_MIN
					} else if (typeof value === 'object') {
						if (typeof value.$start !== 'undefined') {
							itemStart[col.name] = isInteger ? Long.fromNumber(value.$start) : value.$start
						}
						if (typeof value.$end !== 'undefined') {
							itemEnd[col.name] = isInteger ? Long.fromNumber(value.$end) : value.$end
						}
					} else {
						itemStart[col.name] = isInteger ? Long.fromNumber(value) : value
						itemEnd[col.name] = itemStart[col.name]
					}

					params.inclusiveStartPrimaryKey.push(itemStart)
					params.exclusiveEndPrimaryKey.push(itemEnd)
				} else {
					processFilter(params, condNum, col, value)
				}
			}
		}

		const res = await this.instance.client.getRange(params)
		const _self = this

		this.setDateGetter(res, true)

		Object.defineProperty(res, 'next', {
			async value() {
				/// @ts-ignore
				if (!this.next_start_primary_key) {
					return null
				}

				const nextParams = Object.assign({}, params, {
					/// @ts-ignore
					inclusiveStartPrimaryKey: this.next_start_primary_key.map((item) => {
						const _item: any = {}
						_item[item.name] = item.value
						return _item
					})
				})

				return await _self.find(nextParams)
			}
		})

		return res
    }

    // update | updateOne (UpdateRow)
	async update(query: any, values: any, opts?: any) {
		const params: any = {
			tableName: this.name,
			condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
			primaryKey: [],
			updateOfAttributeColumns: []
		}

		for (const col of this.schema.columns) {
			let item: any = {}
			let value: any = query[col.name]

			if (col.primaryKey) {
				if (typeof value === 'undefined' || value === null) {
					throw new TablelizeError(`All the primary keys must be to define in the find query.'`)
				} else if (typeof value === 'object') {
				} else {
					item[col.name] = (col.type === Tablelize.INTEGER) ? Long.fromNumber(value) : value
					params.primaryKey.push(item)
				}
			}
		}

		const putArray = []
		// const deleteArray = []
		const deleteAllArray = []

		for (const col of this.schema.columns) {
			if (!col.primaryKey && values[col.name]) {
				let item: any = {}
				let value: any = values[col.name]

				if (value === null) {
					deleteAllArray.push(col.name)
				} else {
					item[col.name] = (col.type === Tablelize.INTEGER) ? Long.fromNumber(value) : value
					putArray.push(item)
				}
			}
		}

		if (putArray.length) {
			params.updateOfAttributeColumns.push({
				'PUT': putArray
			})
		}

		// if (deleteArray.length) {
		// 	params.updateOfAttributeColumns.push({
		// 		'DELETE': deleteArray
		// 	})
		// }

		if (deleteAllArray.length) {
			params.updateOfAttributeColumns.push({
				'DELETE_ALL': deleteAllArray
			})
		}

		const res = await this.instance.client.updateRow(params)

		return res
    }

    // delete | deleteOne | remove (DeleteRow)
	async delete(query: any, opts?: any) {
		const params: any = {
			tableName: this.name,
			condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
			primaryKey: []
		}

		for (const col of this.schema.columns) {
			let item: any = {}
			let value: any = query[col.name]

			if (col.primaryKey) {
				if (typeof value === 'undefined' || value === null) {
					throw new TablelizeError(`All the primary keys must be to define in the find query.'`)
				} else if (typeof value === 'object') {
				} else {
					item[col.name] = (col.type === Tablelize.INTEGER) ? Long.fromNumber(value) : value
					params.primaryKey.push(item)
				}
			}
		}

		const res = await this.instance.client.deleteRow(params)

		return res
	}

	// alias ↓
	updateOne() {
		return this.update.apply(this, arguments)
	}

    deleteOne() {
		return this.delete.apply(this, arguments)
    }

    remove() {
		logger.warn('\'remove\' is deprecated, please use \'delete\' instead.')

		return this.delete.apply(this, arguments)
    }
}

export default Model
