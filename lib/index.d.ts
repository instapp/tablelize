/*!
 * Created by Acathur on Wed May 30 2018
 * Copyright (c) 2018 Instapp
 */
import { ConstructorConfig, ConstructorOptions, Client } from './interfaces';
import Model from './Model';
import Schema from './Schema';
declare class Tablelize {
    static readonly INTEGER: string;
    static readonly STRING: string;
    static readonly DOUBLE: string;
    static readonly BOOLEAN: string;
    static readonly BINARY: string;
    static readonly Direction: {
        FORWARD: any;
        BACKWARD: any;
    };
    static Schema: typeof Schema;
    client: Client;
    constructor(config: ConstructorConfig, opts: ConstructorOptions);
    model(name: string, schema: any): Model;
    define(name: string, schema: any): Model;
    listTable(): Promise<any>;
}
export default Tablelize;
