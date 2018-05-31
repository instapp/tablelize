/*!
 * Created by Acathur on Thu May 31 2018
 * Copyright (c) 2018 Instapp
 */
import { Column, ColumnMap } from '../interfaces';
export declare const conditionNumberCheck: (query: any, columnMap: ColumnMap) => number;
export declare const processFilter: (params: any, condNum: number, col: Column, val: any) => void;
