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
const definitions_1 = require("./definitions");
const Model_1 = __importDefault(require("./Model"));
const Schema_1 = __importDefault(require("./Schema"));
const TablelizeError_1 = __importDefault(require("./utils/TablelizeError"));
class Tablelize {
    constructor(config, opts) {
        for (const key of definitions_1.REQUIRED_CONFIG) {
            if (!config[key]) {
                throw new TablelizeError_1.default(`'${key}' is required`);
            }
        }
        this.client = new tablestore_1.default.Client(config);
    }
    model(name, schema) {
        return new Model_1.default(name, schema, this);
    }
    listTable() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.client.listTable();
            return res.table_names;
        });
    }
}
Tablelize.INTEGER = 'INTEGER';
Tablelize.STRING = 'STRING';
Tablelize.DOUBLE = 'DOUBLE';
Tablelize.BOOLEAN = 'BOOLEAN';
Tablelize.BINARY = 'BINARY';
Tablelize.FORWARD = tablestore_1.default.Direction.FORWARD;
Tablelize.BACKWARD = tablestore_1.default.Direction.BACKWARD;
Tablelize.Schema = Schema_1.default;
exports.default = Tablelize;
//# sourceMappingURL=index.js.map