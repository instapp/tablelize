/*!
 * Created by Acathur on Wed May 30 2018
 * Copyright (c) 2018 Instapp
 */

import camelcaseKeys from 'camelcase-keys'
import Tablelize from '.'
import { CreateTableOptions, UpdateTableOptions } from './interfaces'
import Schema from './Schema'
// import logger from './utils/logger'
import TablelizeError from './utils/TablelizeError'
import processTableOptions from './utils/processTableOptions'

class Table {

	public name: string
	public schema: Schema

	protected instance: Tablelize

	constructor(name: string, schema: any, instance: Tablelize) {
		this.name = name
		this.schema = schema
		this.instance = instance
	}

	/*
		- create
		- update
		- delete | drop
		- describe
	*/

	// create (createTable)
	async create(opts: CreateTableOptions | any) {
		processTableOptions(opts)

		if (!this.name || !this.schema) {
			throw new TablelizeError(`Please define your table with .model() first.`)
		}

		opts.tableMeta = {
			tableName: this.name,
			primaryKey: this.schema.primaryKey
		}

		await this.instance.client.createTable(opts)

		return true
	}

	// update (updateTable)
	async update(opts: UpdateTableOptions | any) {
		processTableOptions(opts)

		if (!this.name) {
			throw new TablelizeError(`Please define your table with .model() first.`)
		}

		opts.tableName = this.name

		const res = await this.instance.client.updateTable(opts)

		const ret = camelcaseKeys(res, {
			deep: true
		})

		return ret
	}

	// delete (deleteTable)
	async delete() {
		await this.instance.client.deleteTable({
			tableName: this.name
		})

		return true
	}

	// describe (describeTable)
	async describe() {
		const res = await this.instance.client.describeTable({
			tableName: this.name
		})

		const ret = camelcaseKeys(res, {
			deep: true
		})

		return ret
	}

	// drop
	drop() {
		return this.delete()
	}
}

export default Table
