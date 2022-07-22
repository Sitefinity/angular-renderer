export interface ContentListModelDetail {
    ViewName: string;
    DetailItem: {
        Id: string;
        ProviderName: string;
        ItemType: string;
    },
    Attributes: { [key: string]: Array<{ Key: string, Value: string}> };
}
