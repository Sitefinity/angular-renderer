import { SdkItem } from "src/app/sdk/sdk-item";

export interface ContentListViewModelDetail {
    ViewName: string;
    DetailItem: SdkItem,
    Attributes: { [key: string]: string };
}
