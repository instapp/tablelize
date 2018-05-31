/*!
 * Created by Acathur on Wed May 30 2018
 * Copyright (c) 2018 Instapp
 */

import TableStore from 'tablestore'
import { REQUIRED_CONFIG } from './definitions'
import { ConstructorConfig, ConstructorOptions, Client } from './interfaces'
import Model from './Model'
import Schema from './Schema'
import TablelizeError from './utils/TablelizeError'

class Tablelize {

    // types
    static readonly INTEGER = 'INTEGER'  // int64 (node)
    static readonly STRING = 'STRING'    // String
    static readonly DOUBLE = 'DOUBLE'    // Number
    static readonly BOOLEAN = 'BOOLEAN'  // Boolean
    static readonly BINARY = 'BINARY'    // Buffer

    // directions
    static readonly FORWARD = TableStore.Direction.FORWARD
	static readonly BACKWARD = TableStore.Direction.BACKWARD

	// static class
	static Schema = Schema

	// prototypes
	public client: Client

    constructor(config: ConstructorConfig, opts: ConstructorOptions) {

        for (const key of REQUIRED_CONFIG) {
            if (!config[key]) {
				throw new TablelizeError(`'${key}' is required`)
            }
		}

		this.client = new TableStore.Client(config)
    }

	model(name: string, schema: any) {
		return new Model(name, schema, this)
	}

	async listTable() {
		const res = await this.client.listTable()

		return res.table_names
	}
}

export default Tablelize
