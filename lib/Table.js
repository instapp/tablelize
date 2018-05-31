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
const camelcase_keys_1 = __importDefault(require("camelcase-keys"));
const TablelizeError_1 = __importDefault(require("./utils/TablelizeError"));
const processTableOptions_1 = __importDefault(require("./utils/processTableOptions"));
class Table {
    constructor(name, schema, instance) {
        this.name = name;
        this.schema = schema;
        this.instance = instance;
    }
    create(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            processTableOptions_1.default(opts);
            if (!this.name || !this.schema) {
                throw new TablelizeError_1.default(`Please define your table with .model() first.`);
            }
            opts.tableMeta = {
                tableName: this.name,
                primaryKey: this.schema.primaryKey
            };
            yield this.instance.client.createTable(opts);
            return true;
        });
    }
    update(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            processTableOptions_1.default(opts);
            if (!this.name) {
                throw new TablelizeError_1.default(`Please define your table with .model() first.`);
            }
            opts.tableName = this.name;
            const res = yield this.instance.client.updateTable(opts);
            const ret = camelcase_keys_1.default(res, {
                deep: true
            });
            return ret;
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.instance.client.deleteTable({
                tableName: this.name
            });
            return true;
        });
    }
    describe() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.instance.client.describeTable({
                tableName: this.name
            });
            const ret = camelcase_keys_1.default(res, {
                deep: true
            });
            return ret;
        });
    }
    drop() {
        return this.delete();
    }
}
exports.default = Table;
//# sourceMappingURL=Table.js.map