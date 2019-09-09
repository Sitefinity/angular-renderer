import { ModelBase } from "./model-base";

export class ContainerModel extends ModelBase {
    Name: "Layout";
    Properties: [{ [key: string]: string }];
    ViewName: string;
}

export interface ColumnModel {
    css: string;
    label: string;
    children: ModelBase[];
}

export const LayoutColumns = {
    "1-column": 1,
    "2-columns": 2,
    "3-columns": 3,
    "4-columns": 4,
    "5-columns": 5,
    "6-columns": 6,
};
