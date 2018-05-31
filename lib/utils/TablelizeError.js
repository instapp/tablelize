"use strict";
/*!
 * Created by Acathur on Wed May 30 2018
 * Copyright (c) 2018 Instapp
 */
Object.defineProperty(exports, "__esModule", { value: true });
class TablelizeError extends Error {
    constructor(message) {
        super(message);
        this.name = '[TablelizeError]';
    }
}
exports.default = TablelizeError;
//# sourceMappingURL=TablelizeError.js.map