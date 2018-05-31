/*!
 * Created by Acathur on Wed May 30 2018
 * Copyright (c) 2018 Instapp
 */

export type Client = any

export interface ConstructorConfig {
    accessKeyId: string
    secretAccessKey: string
    endpoint: string
    instancename: string
    stsToken?: string
    maxRetries?: number
    [key: string]: ConstructorConfig[keyof ConstructorConfig]
}

export interface ConstructorOptions {
    debug?: boolean
}

// table
export interface TableMeta {
	tableName: string
	primaryKey: {
		name: string
		type: string
	}[]
}

export interface ReservedThroughput {
	capacityUnit: {
		read: number
		write: number
	}
}

export interface TableOptions {
	timeToLive: number
	maxVersions: number
	deviationCellVersionInSec?: number
}

export interface StreamSpecification {
	enableStream: boolean
	expirationTime: number
}

export interface CreateTableOptions {
	tableMeta?: TableMeta
	reservedThroughput: ReservedThroughput
	tableOptions: TableOptions
	streamSpec?: StreamSpecification
}

export interface UpdateTableOptions {
	tableName?: string
	reservedThroughput: ReservedThroughput
	tableOptions: TableOptions
	streamSpec?: StreamSpecification
}

// schema

export interface PrimaryKey {
	name: string
	type: string
	option?: string
}

export interface Column {
	name: string
	type: string
	primaryKey?: boolean
	autoIncrement?: boolean
	defaultValue?: any
}

export interface ColumnMap {
	[key: string]: Column[keyof Column]
}

export interface TableRowPrimaryKey {
	name: string,
	value: any
}

export interface TableRowAttribute {
	columnName: string,
	columnValue: any,
	timestamp?: any
}

export interface TableRow {
	primaryKey: TableRowPrimaryKey[]
	attributes: TableRowAttribute[]
}

export interface FindOptions {
	limit?: number
	direction?: string
}
