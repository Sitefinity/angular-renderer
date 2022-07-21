import { ModelBase } from "src/app/models/model-base";

export interface ColumnHolder {
    Attributes: { [key: string]: string },
    Children: Array<ModelBase<any>>
}
