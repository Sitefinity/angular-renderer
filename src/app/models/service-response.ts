import { DetailItem } from "../services/detail-item";
import { ModelBase } from "./model-base";

export interface PageLayoutServiceResponse {
    Culture: string;
    SiteId: string;
    ComponentContext: ComponentContext;
    MetaInfo: {
        Title: string,
        Description: string,
        HtmlInHeadTag: string,
        OpenGraphTitle: string,
        OpenGraphDescription: string,
        OpenGraphImage: string,
        OpenGraphVideo: string,
        OpenGraphType: string,
        OpenGraphSite: string,
        CanonicalUrl: string,
    },
    DetailItem: DetailItem,
    UrlParameters: string[]
}

export interface ComponentContext {
    Components: ModelBase<any>[];
    HasLazyComponents: boolean;
}

export interface ODataEntityResponse {
    "@odata.context": string;
    Author: string;
    Category: string[];
    Content: string;
    DateCreated: string;
    Description: string;
    Id: string;
    LastModified: string;
    Name: string;
    Provider: string;
    PublicationDate: string;
    Tags: string[];
    Title: string;
    UrlName: string;
}
