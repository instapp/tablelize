/*!
 * Created by Acathur on Wed May 30 2018
 * Copyright (c) 2018 Instapp
 */

import { CreateTableOptions } from '../interfaces'
import logger from '../utils/logger'
import TablelizeError from '../utils/TablelizeError'

const processTableOptions = (opts: CreateTableOptions | any) => {
	opts = opts || {}

	if (opts.tableMeta) {
		logger.warn(`'tableMeta' is not identified, please define your table with .model()`)
		delete opts.tableMeta
	}

	if (opts.tableName) {
		logger.warn(`'tableName' is not identified, please define your table with .model()`)
		delete opts.tableName
	}

	if (!opts.reservedThroughput) {
		throw new TablelizeError(`'reservedThroughput' is required`)
	} else if (!opts.reservedThroughput.capacityUnit) {
		throw new TablelizeError(`'reservedThroughput.capacityUnit' is required`)
	} else if (typeof opts.reservedThroughput.capacityUnit.read === undefined && typeof opts.reservedThroughput.capacityUnit.write === undefined) {
		throw new TablelizeError(`In 'reservedThroughput.capacityUnit' read and write must at least have a non-null value.`)
	}

	if (!opts.tableOptions) {
		throw new TablelizeError(`'tableOptions' is required`)
	}

}

export default processTableOptions
