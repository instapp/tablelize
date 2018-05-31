"use strict";
/*!
 * Created by Acathur on Wed May 30 2018
 * Copyright (c) 2018 Instapp
 */
Object.defineProperty(exports, "__esModule", { value: true });
const logger = console;
logger.error = function (e) {
    throw new Error(e);
};
exports.default = logger;
//# sourceMappingURL=logger.js.map