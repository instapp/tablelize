/*!
 * Created by Acathur on Wed May 30 2018
 * Copyright (c) 2018 Instapp
 */
import { Column, ColumnMap, PrimaryKey } from './interfaces';
declare class Schema {
    primaryKey: PrimaryKey[];
    columns: Column[];
    columnMap: ColumnMap;
    fields: string[];
    constructor(columns: any);
}
export default Schema;
