/*!
 * Created by Acathur on Wed May 30 2018
 * Copyright (c) 2018 Instapp
 */

const logger = console

logger.error = function (e: any) {
	throw new Error(e)
}

export default logger
