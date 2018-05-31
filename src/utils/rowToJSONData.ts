/*!
 * Created by Acathur on Thu May 31 2018
 * Copyright (c) 2018 Instapp
 */

import Tablelize from '..'
import { TableRow, ColumnMap } from '../interfaces'

const rowToJSONData = (row: TableRow, columnMap?: ColumnMap): Object => {
	if (!row.primaryKey) {
		return null
	}

	const data: any = {}

	for (const pk of row.primaryKey) {
		data[pk.name] = (columnMap && columnMap[pk.name].type === Tablelize.INTEGER) ? Number(pk.value) : pk.value
	}

	for (const attr of row.attributes) {
		data[attr.columnName] = (columnMap && columnMap[attr.columnName].type === Tablelize.INTEGER) ? Number(attr.columnValue) : attr.columnValue
	}

	return data
}

export default rowToJSONData
