"use strict";
/*!
 * Created by Acathur on Thu May 31 2018
 * Copyright (c) 2018 Instapp
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require(".."));
const rowToJSONData = (row, columnMap) => {
    if (!row.primaryKey) {
        return null;
    }
    const data = {};
    for (const pk of row.primaryKey) {
        data[pk.name] = (columnMap && columnMap[pk.name].type === __1.default.INTEGER) ? Number(pk.value) : pk.value;
    }
    for (const attr of row.attributes) {
        data[attr.columnName] = (columnMap && columnMap[attr.columnName].type === __1.default.INTEGER) ? Number(attr.columnValue) : attr.columnValue;
    }
    return data;
};
exports.default = rowToJSONData;
//# sourceMappingURL=rowToJSONData.js.map