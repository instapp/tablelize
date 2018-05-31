/*!
 * Created by Acathur on Wed May 30 2018
 * Copyright (c) 2018 Instapp
 */

import { Column, ColumnMap, PrimaryKey } from './interfaces'
import { SUPPORTED_DATA_TYPE, SUPPORTED_DATA_TYPE_FOR_PRIMARY_KEY, SUPPORTED_TYPE_MAP, SUPPORTED_DEFAULT_VALUE_TYPE } from './definitions'
import TablelizeError from './utils/TablelizeError'
// import logger from './utils/logger';

const getTypeSpecFromType = (type: any) => {
	const spec = SUPPORTED_TYPE_MAP[type.name]

	return spec ? spec.type : null
}

class Schema {

	public primaryKey: PrimaryKey[]
	public columns: Column[]
	public columnMap: ColumnMap
	public fields: string[]

	constructor(columns: any) {
		columns = columns || {}

		const fieldArray: string[] = []
		const columnArray: Column[] = []
		const primaryKeyArray: PrimaryKey[] = []

		for (const field in columns) {
			const vaule = columns[field]
			const column: Column = {
				name: field,
				type: undefined
			}

			switch (typeof vaule) {
				case 'string':
					if (!SUPPORTED_DATA_TYPE.includes(vaule)) {
						throw new TablelizeError(`'${vaule}' is not supported for the column type.`)
					}

					column.type = vaule
					break

				case 'function':
					const type = getTypeSpecFromType(vaule)

					if (!type) {
						throw new TablelizeError(`'${vaule.name}' is not supported for the column type.`)
					}

					column.type = type
					break

				case 'object':
					if (!vaule.type) {
						throw new TablelizeError(`'type' is required for column.`)
					}

					column.type = vaule.type

					// alias: primary -> primaryKey
					if (vaule.primary) {
						vaule.primaryKey = vaule.primary
					}

					// alias: default -> defaultValue
					if (vaule.default) {
						vaule.defaultValue = vaule.default
					}

					if (vaule.primaryKey) {
						if (typeof vaule.primaryKey !== 'boolean') {
							throw new TablelizeError(`'primary' vaule must be a boolean.`)
						}

						if (!SUPPORTED_DATA_TYPE_FOR_PRIMARY_KEY.includes(column.type)) {
							throw new TablelizeError(`The data types of the primary key column can only be String, Integer, and Binary.`)
						}

						const primaryKeyItem: PrimaryKey = {
							name: column.name,
							type: column.type
						}

						column.primaryKey = true

						if (vaule.autoIncrement) {
							column.autoIncrement = true
							primaryKeyItem.option = 'AUTO_INCREMENT'
						}

						primaryKeyArray.push(primaryKeyItem)
					}

					if (vaule.defaultValue) {
						if (!SUPPORTED_DEFAULT_VALUE_TYPE.includes(typeof vaule.default)) {
							throw new TablelizeError(`'default' vaule must be a string or a function.`)
						}
						column.defaultValue = vaule.defaultValue
					}
					break

				default:
					throw new TablelizeError(`'${typeof vaule}' is not supported for the column.`)
			}

			fieldArray.push(field)
			columnArray.push(column)
		}

		if (primaryKeyArray.length < 1) {
			throw new TablelizeError(`You have to set at least 1 primary key for the table.`)
		} else if (primaryKeyArray.length > 4) {
			throw new TablelizeError(`The maximum number of primary keys for the table is 4.`)
		}

		this.fields = fieldArray
		this.columns = columnArray
		this.primaryKey = primaryKeyArray
		this.columnMap = columnArray.reduce((map: any, item: Column) => {
			map[item.name] = item
			return map
		}, {})
	}
}

export default Schema
