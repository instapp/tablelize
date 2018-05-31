"use strict";
/*!
 * Created by Acathur on Wed May 30 2018
 * Copyright (c) 2018 Instapp
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("./definitions");
const TablelizeError_1 = __importDefault(require("./utils/TablelizeError"));
const getTypeSpecFromType = (type) => {
    const spec = definitions_1.SUPPORTED_TYPE_MAP[type.name];
    return spec ? spec.type : null;
};
class Schema {
    constructor(columns) {
        columns = columns || {};
        const fieldArray = [];
        const columnArray = [];
        const primaryKeyArray = [];
        for (const field in columns) {
            const vaule = columns[field];
            const column = {
                name: field,
                type: undefined
            };
            switch (typeof vaule) {
                case 'string':
                    if (!definitions_1.SUPPORTED_DATA_TYPE.includes(vaule)) {
                        throw new TablelizeError_1.default(`'${vaule}' is not supported for the column type.`);
                    }
                    column.type = vaule;
                    break;
                case 'function':
                    const type = getTypeSpecFromType(vaule);
                    if (!type) {
                        throw new TablelizeError_1.default(`'${vaule.name}' is not supported for the column type.`);
                    }
                    column.type = type;
                    break;
                case 'object':
                    if (!vaule.type) {
                        throw new TablelizeError_1.default(`'type' is required for column.`);
                    }
                    column.type = vaule.type;
                    if (vaule.primary) {
                        vaule.primaryKey = vaule.primary;
                    }
                    if (vaule.default) {
                        vaule.defaultValue = vaule.default;
                    }
                    if (vaule.primaryKey) {
                        if (typeof vaule.primaryKey !== 'boolean') {
                            throw new TablelizeError_1.default(`'primary' vaule must be a boolean.`);
                        }
                        if (!definitions_1.SUPPORTED_DATA_TYPE_FOR_PRIMARY_KEY.includes(column.type)) {
                            throw new TablelizeError_1.default(`The data types of the primary key column can only be String, Integer, and Binary.`);
                        }
                        const primaryKeyItem = {
                            name: column.name,
                            type: column.type
                        };
                        column.primaryKey = true;
                        if (vaule.autoIncrement) {
                            column.autoIncrement = true;
                            primaryKeyItem.option = 'AUTO_INCREMENT';
                        }
                        primaryKeyArray.push(primaryKeyItem);
                    }
                    if (vaule.defaultValue) {
                        if (!definitions_1.SUPPORTED_DEFAULT_VALUE_TYPE.includes(typeof vaule.default)) {
                            throw new TablelizeError_1.default(`'default' vaule must be a string or a function.`);
                        }
                        column.defaultValue = vaule.defaultValue;
                    }
                    break;
                default:
                    throw new TablelizeError_1.default(`'${typeof vaule}' is not supported for the column.`);
            }
            fieldArray.push(field);
            columnArray.push(column);
        }
        if (primaryKeyArray.length < 1) {
            throw new TablelizeError_1.default(`You have to set at least 1 primary key for the table.`);
        }
        else if (primaryKeyArray.length > 4) {
            throw new TablelizeError_1.default(`The maximum number of primary keys for the table is 4.`);
        }
        this.fields = fieldArray;
        this.columns = columnArray;
        this.primaryKey = primaryKeyArray;
        this.columnMap = columnArray.reduce((map, item) => {
            map[item.name] = item;
            return map;
        }, {});
    }
}
exports.default = Schema;
//# sourceMappingURL=Schema.js.map