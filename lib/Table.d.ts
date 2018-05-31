/*!
 * Created by Acathur on Wed May 30 2018
 * Copyright (c) 2018 Instapp
 */
import Tablelize from '.';
import { CreateTableOptions, UpdateTableOptions } from './interfaces';
import Schema from './Schema';
declare class Table {
    name: string;
    schema: Schema;
    protected instance: Tablelize;
    constructor(name: string, schema: any, instance: Tablelize);
    create(opts: CreateTableOptions | any): Promise<boolean>;
    update(opts: UpdateTableOptions | any): Promise<any>;
    delete(): Promise<boolean>;
    describe(): Promise<any>;
    drop(): Promise<boolean>;
}
export default Table;
