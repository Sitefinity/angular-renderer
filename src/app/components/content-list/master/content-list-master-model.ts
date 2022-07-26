import { Observable } from "rxjs";
import { CollectionResponse } from "src/app/sdk/collection-response";
import { SdkItem } from "src/app/sdk/sdk-item";

export interface ContentListModelMaster {
    OpenDetails: boolean;
    FieldCssClassMap: { [key: string]: string };
    FieldMap: { [key: string]: string };
    Items$: Observable<CollectionResponse<SdkItem>>,
    ViewName: "CardsList" | "ListWithImage" | "ListWithSummary";
    Attributes: Array<{ Key: string, Value: string }>;
}
