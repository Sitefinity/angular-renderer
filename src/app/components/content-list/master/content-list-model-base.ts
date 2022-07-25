import { CollectionResponse } from "src/app/sdk/collection-response";
import { SdkItem } from "src/app/sdk/sdk-item";

export interface ContentListModelbase {
    Attributes: {[key: string]: string}
    OpenDetails: boolean
    Pager?: {}
}
