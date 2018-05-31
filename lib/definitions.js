"use strict";
/*!
 * Created by Acathur on Wed May 30 2018
 * Copyright (c) 2018 Instapp
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.REQUIRED_CONFIG = ['accessKeyId', 'secretAccessKey', 'endpoint', 'instancename'];
exports.SUPPORTED_DATA_TYPE = ['INTEGER', 'STRING', 'DOUBLE', 'BOOLEAN', 'BINARY'];
exports.SUPPORTED_DATA_TYPE_FOR_PRIMARY_KEY = ['INTEGER', 'STRING', 'BINARY'];
exports.SUPPORTED_DEFAULT_VALUE_TYPE = ['string', 'function'];
exports.SUPPORTED_TYPE_MAP = {
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
};
//# sourceMappingURL=definitions.js.map