/*!
 * Created by Acathur on Wed May 30 2018
 * Copyright (c) 2018 Instapp
 */

export const REQUIRED_CONFIG = ['accessKeyId', 'secretAccessKey', 'endpoint', 'instancename']
export const SUPPORTED_DATA_TYPE = ['INTEGER', 'STRING', 'DOUBLE', 'BOOLEAN', 'BINARY']
export const SUPPORTED_DATA_TYPE_FOR_PRIMARY_KEY = ['INTEGER','STRING','BINARY']
export const SUPPORTED_DEFAULT_VALUE_TYPE = ['string', 'function']
export const SUPPORTED_TYPE_MAP: any = {
	String: {
		type: 'STRING'
	},
	Number: {
		type: 'DOUBLE'
	},
	Boolean: {
		type: 'BOOLEAN'
	},
	Buffer: {
		type: 'BINARY'
	}
}
