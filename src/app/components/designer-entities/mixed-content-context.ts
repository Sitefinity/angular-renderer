export interface MixedContentContext {
    ItemIdsOrders: string[],
    Content: ContentContext[]
}

interface ContentContext {
    Type: string;
    Variations: ContentVariation[]
}

interface ContentVariation {
    Source: string;
    Filter: { Key: string, Value: string };
    DynamicFilterByParent: boolean;
}
