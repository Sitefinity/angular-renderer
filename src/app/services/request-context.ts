import { ModelBase } from "../models/model-base";
import { DetailItem } from "./detail-item";

export interface RequestContext {
    DetailItem: DetailItem | null;
    LazyComponentMap: { [key: string]: ModelBase<any> } | null;
}
