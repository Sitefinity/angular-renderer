import { ModelBase } from "src/app/models/model-base";
import { AttributeHolder } from "./attribute-holder";

export interface ColumnHolder {
    Attributes: { [key: string]: string },
    Children: Array<ModelBase<any>>
}
