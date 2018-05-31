/*!
 * Created by Acathur on Wed May 30 2018
 * Copyright (c) 2018 Instapp
 */

class TablelizeError extends Error {

	name = '[TablelizeError]'

	constructor(message: any) {
		super(message)
	}
}

export default TablelizeError
