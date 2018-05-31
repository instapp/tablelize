"use strict";
/*!
 * Created by Acathur on Thu May 31 2018
 * Copyright (c) 2018 Instapp
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tablestore_1 = __importDefault(require("tablestore"));
const __1 = __importDefault(require(".."));
const Long = tablestore_1.default.Long;
exports.conditionNumberCheck = (query, columnMap) => {
    if (!query) {
        return 0;
    }
    return Object.keys(query).reduce((num, key) => {
        let targetCol = columnMap[key];
        if (targetCol && !targetCol.primaryKey) {
            num++;
        }
        return num;
    }, 0);
};
exports.processFilter = (params, condNum, col, val) => {
    if (typeof val !== 'undefined') {
        val = (col.type === __1.default.INTEGER) ? Long.fromNumber(val) : val;
        if (condNum > 1) {
            if (!params.columnFilter) {
                params.columnFilter = new tablestore_1.default.CompositeCondition(tablestore_1.default.LogicalOperator.AND);
            }
            params.columnFilter.addSubCondition(new tablestore_1.default.SingleColumnCondition(col.name, val, tablestore_1.default.ComparatorType.EQUAL));
        }
        else {
            params.columnFilter = new tablestore_1.default.SingleColumnCondition(col.name, val, tablestore_1.default.ComparatorType.EQUAL);
        }
    }
};
//# sourceMappingURL=filterTools.js.map