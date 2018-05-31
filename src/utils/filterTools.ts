/*!
 * Created by Acathur on Thu May 31 2018
 * Copyright (c) 2018 Instapp
 */

import TableStore from 'tablestore'
import Tablelize from '..'
import { Column, ColumnMap } from '../interfaces'

const Long = TableStore.Long

export const conditionNumberCheck = (query: any, columnMap: ColumnMap) => {
	if (!query) {
		return 0
	}

	return Object.keys(query).reduce((num: number, key: string) => {
		let targetCol = columnMap[key]

		if (targetCol && !targetCol.primaryKey) {
			num++
		}

		return num
	}, 0)
}

export const processFilter = (params: any, condNum: number, col: Column, val: any) => {
	if (typeof val !== 'undefined') {
		val = (col.type === Tablelize.INTEGER) ? Long.fromNumber(val) : val

		if (condNum > 1) {
			if (!params.columnFilter) {
				params.columnFilter = new TableStore.CompositeCondition(TableStore.LogicalOperator.AND)
			}
			params.columnFilter.addSubCondition(new TableStore.SingleColumnCondition(col.name, val, TableStore.ComparatorType.EQUAL))
		} else {
			params.columnFilter = new TableStore.SingleColumnCondition(col.name, val, TableStore.ComparatorType.EQUAL)
		}
	}
}
