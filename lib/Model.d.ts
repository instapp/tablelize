/*!
 * Created by Acathur on Wed May 30 2018
 * Copyright (c) 2018 Instapp
 */
import Tablelize from '.';
import { CreateTableOptions, FindOptions } from './interfaces';
import Schema from './Schema';
import Table from './Table';
declare class Model {
    name: string;
    schema: Schema;
    protected table: Table;
    protected instance: Tablelize;
    constructor(name: string, schema: any, instance: Tablelize);
    private setDateGetter(response, isArray?);
    init(opts: CreateTableOptions | any): Promise<any>;
    drop(): Promise<boolean>;
    insert(row: any, opts?: any): Promise<any>;
    findOne(query: any, opts?: any): Promise<any>;
    find(query: any, opts?: FindOptions): Promise<any>;
    update(query: any, values: any, opts?: any): Promise<any>;
    delete(query: any, opts?: any): Promise<any>;
    updateOne(): any;
    deleteOne(): any;
    remove(): any;
}
export default Model;
