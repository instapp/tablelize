"use strict";
/*!
 * Created by Acathur on Wed May 30 2018
 * Copyright (c) 2018 Instapp
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../utils/logger"));
const TablelizeError_1 = __importDefault(require("../utils/TablelizeError"));
const processTableOptions = (opts) => {
    opts = opts || {};
    if (opts.tableMeta) {
        logger_1.default.warn(`'tableMeta' is not identified, please define your table with .model()`);
        delete opts.tableMeta;
    }
    if (opts.tableName) {
        logger_1.default.warn(`'tableName' is not identified, please define your table with .model()`);
        delete opts.tableName;
    }
    if (!opts.reservedThroughput) {
        throw new TablelizeError_1.default(`'reservedThroughput' is required`);
    }
    else if (!opts.reservedThroughput.capacityUnit) {
        throw new TablelizeError_1.default(`'reservedThroughput.capacityUnit' is required`);
    }
    else if (typeof opts.reservedThroughput.capacityUnit.read === undefined && typeof opts.reservedThroughput.capacityUnit.write === undefined) {
        throw new TablelizeError_1.default(`In 'reservedThroughput.capacityUnit' read and write must at least have a non-null value.`);
    }
    if (!opts.tableOptions) {
        throw new TablelizeError_1.default(`'tableOptions' is required`);
    }
};
exports.default = processTableOptions;
//# sourceMappingURL=processTableOptions.js.map