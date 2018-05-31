"use strict";
/*!
 * Created by Acathur on Wed May 30 2018
 * Copyright (c) 2018 Instapp
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tablestore_1 = __importDefault(require("tablestore"));
const _1 = __importDefault(require("."));
const Schema_1 = __importDefault(require("./Schema"));
const Table_1 = __importDefault(require("./Table"));
const logger_1 = __importDefault(require("./utils/logger"));
const rowToJSONData_1 = __importDefault(require("./utils/rowToJSONData"));
const filterTools_1 = require("./utils/filterTools");
const processTableOptions_1 = __importDefault(require("./utils/processTableOptions"));
const TablelizeError_1 = __importDefault(require("./utils/TablelizeError"));
const Long = tablestore_1.default.Long;
class Model {
    constructor(name, schema, instance) {
        if (!(schema instanceof Schema_1.default)) {
            schema = new Schema_1.default(schema);
        }
        this.name = name;
        this.schema = schema;
        this.instance = instance;
        this.table = new Table_1.default(this.name, this.schema, this.instance);
    }
    setDateGetter(response, isArray = false) {
        const columnMap = this.schema.columnMap;
        if (isArray || Array.isArray(response.rows)) {
            Object.defineProperty(response, 'data', {
                get() {
                    return this.rows.map((item) => rowToJSONData_1.default(item, columnMap));
                }
            });
        }
        else {
            Object.defineProperty(response, 'data', {
                get() {
                    return rowToJSONData_1.default(this.row, columnMap);
                }
            });
        }
    }
    init(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            processTableOptions_1.default(opts);
            const tables = yield this.instance.listTable();
            if (!tables.includes(this.name)) {
                return yield this.table.create(opts);
            }
            else {
                const desc = yield this.table.describe();
                if ((opts.reservedThroughput.capacityUnit.read && opts.reservedThroughput.capacityUnit.read !== desc.reservedThroughput.capacityUnit.read) ||
                    (opts.reservedThroughput.capacityUnit.write && opts.reservedThroughput.capacityUnit.write !== desc.reservedThroughput.capacityUnit.write) ||
                    opts.tableOptions.timeToLive !== desc.tableOptions.timeToLive ||
                    opts.tableOptions.maxVersions !== desc.tableOptions.maxVersions) {
                    return yield this.table.update(opts);
                }
            }
            return true;
        });
    }
    drop() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.table.delete();
        });
    }
    insert(row, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                tableName: this.name,
                condition: new tablestore_1.default.Condition(tablestore_1.default.RowExistenceExpectation.IGNORE, null),
                primaryKey: [],
                attributeColumns: [],
                returnContent: {
                    returnType: tablestore_1.default.ReturnType.Primarykey
                }
            };
            for (const col of this.schema.columns) {
                let item = {};
                let value = row[col.name];
                if (!value && col.defaultValue) {
                    switch (typeof col.defaultValue) {
                        case 'string':
                            value = col.defaultValue;
                            break;
                        case 'function':
                            value = col.defaultValue();
                            break;
                        default:
                            break;
                    }
                }
                if (value && col.type === _1.default.INTEGER) {
                    value = Long.fromNumber(value);
                }
                if (col.autoIncrement) {
                    item[col.name] = tablestore_1.default.PK_AUTO_INCR;
                    params.primaryKey.push(item);
                }
                else if (col.primaryKey) {
                    item[col.name] = value;
                    params.primaryKey.push(item);
                }
                else {
                    item[col.name] = value;
                    params.attributeColumns.push(item);
                }
            }
            const res = yield this.instance.client.putRow(params);
            this.setDateGetter(res);
            return res;
        });
    }
    findOne(query, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                tableName: this.name,
                primaryKey: []
            };
            const condNum = filterTools_1.conditionNumberCheck(query, this.schema.columnMap);
            for (const col of this.schema.columns) {
                let item = {};
                let value = query[col.name];
                if (col.primaryKey) {
                    if (typeof value === 'undefined' || value === null) {
                        throw new TablelizeError_1.default(`All the primary keys must be to define in the find query.'`);
                    }
                    else if (typeof value === 'object') {
                    }
                    else {
                        item[col.name] = (col.type === _1.default.INTEGER) ? Long.fromNumber(value) : value;
                        params.primaryKey.push(item);
                    }
                }
                else {
                    filterTools_1.processFilter(params, condNum, col, value);
                }
            }
            const res = yield this.instance.client.getRow(params);
            this.setDateGetter(res);
            return res;
        });
    }
    find(query, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            query = query || {};
            opts = opts || {};
            opts.direction = opts.direction || _1.default.FORWARD;
            let params;
            if (query.tableName && query.inclusiveStartPrimaryKey && query.exclusiveEndPrimaryKey) {
                params = query;
            }
            else {
                params = {
                    tableName: this.name,
                    direction: opts.direction,
                    inclusiveStartPrimaryKey: [],
                    exclusiveEndPrimaryKey: []
                };
                const condNum = filterTools_1.conditionNumberCheck(query, this.schema.columnMap);
                if (opts.limit) {
                    params.limit = opts.limit;
                }
                for (const col of this.schema.columns) {
                    let itemStart = {};
                    let itemEnd = {};
                    let value = query[col.name];
                    if (col.primaryKey) {
                        const isInteger = col.type === _1.default.INTEGER;
                        if (typeof value === 'undefined' || value === null) {
                            itemStart[col.name] = (opts.direction === _1.default.FORWARD) ? tablestore_1.default.INF_MIN : tablestore_1.default.INF_MAX;
                            itemEnd[col.name] = (opts.direction === _1.default.FORWARD) ? tablestore_1.default.INF_MAX : tablestore_1.default.INF_MIN;
                        }
                        else if (typeof value === 'object') {
                            if (typeof value.$start !== 'undefined') {
                                itemStart[col.name] = isInteger ? Long.fromNumber(value.$start) : value.$start;
                            }
                            if (typeof value.$end !== 'undefined') {
                                itemEnd[col.name] = isInteger ? Long.fromNumber(value.$end) : value.$end;
                            }
                        }
                        else {
                            itemStart[col.name] = isInteger ? Long.fromNumber(value) : value;
                            itemEnd[col.name] = itemStart[col.name];
                        }
                        params.inclusiveStartPrimaryKey.push(itemStart);
                        params.exclusiveEndPrimaryKey.push(itemEnd);
                    }
                    else {
                        filterTools_1.processFilter(params, condNum, col, value);
                    }
                }
            }
            const res = yield this.instance.client.getRange(params);
            const _self = this;
            this.setDateGetter(res, true);
            Object.defineProperty(res, 'next', {
                value() {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (!this.next_start_primary_key) {
                            return null;
                        }
                        const nextParams = Object.assign({}, params, {
                            inclusiveStartPrimaryKey: this.next_start_primary_key.map((item) => {
                                const _item = {};
                                _item[item.name] = item.value;
                                return _item;
                            })
                        });
                        return yield _self.find(nextParams);
                    });
                }
            });
            return res;
        });
    }
    update(query, values, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                tableName: this.name,
                condition: new tablestore_1.default.Condition(tablestore_1.default.RowExistenceExpectation.IGNORE, null),
                primaryKey: [],
                updateOfAttributeColumns: []
            };
            for (const col of this.schema.columns) {
                let item = {};
                let value = query[col.name];
                if (col.primaryKey) {
                    if (typeof value === 'undefined' || value === null) {
                        throw new TablelizeError_1.default(`All the primary keys must be to define in the find query.'`);
                    }
                    else if (typeof value === 'object') {
                    }
                    else {
                        item[col.name] = (col.type === _1.default.INTEGER) ? Long.fromNumber(value) : value;
                        params.primaryKey.push(item);
                    }
                }
            }
            const putArray = [];
            const deleteAllArray = [];
            for (const col of this.schema.columns) {
                if (!col.primaryKey && values[col.name]) {
                    let item = {};
                    let value = values[col.name];
                    if (value === null) {
                        deleteAllArray.push(col.name);
                    }
                    else {
                        item[col.name] = (col.type === _1.default.INTEGER) ? Long.fromNumber(value) : value;
                        putArray.push(item);
                    }
                }
            }
            if (putArray.length) {
                params.updateOfAttributeColumns.push({
                    'PUT': putArray
                });
            }
            if (deleteAllArray.length) {
                params.updateOfAttributeColumns.push({
                    'DELETE_ALL': deleteAllArray
                });
            }
            const res = yield this.instance.client.updateRow(params);
            return res;
        });
    }
    delete(query, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                tableName: this.name,
                condition: new tablestore_1.default.Condition(tablestore_1.default.RowExistenceExpectation.IGNORE, null),
                primaryKey: []
            };
            for (const col of this.schema.columns) {
                let item = {};
                let value = query[col.name];
                if (col.primaryKey) {
                    if (typeof value === 'undefined' || value === null) {
                        throw new TablelizeError_1.default(`All the primary keys must be to define in the find query.'`);
                    }
                    else if (typeof value === 'object') {
                    }
                    else {
                        item[col.name] = (col.type === _1.default.INTEGER) ? Long.fromNumber(value) : value;
                        params.primaryKey.push(item);
                    }
                }
            }
            const res = yield this.instance.client.deleteRow(params);
            return res;
        });
    }
    updateOne() {
        return this.update.apply(this, arguments);
    }
    deleteOne() {
        return this.delete.apply(this, arguments);
    }
    remove() {
        logger_1.default.warn('\'remove\' is deprecated, please use \'delete\' instead.');
        return this.delete.apply(this, arguments);
    }
}
exports.default = Model;
//# sourceMappingURL=Model.js.map