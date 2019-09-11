import { ModelBase } from "./model-base";

export interface PageContentServiceResponse {
    ComponentContext: ComponentContext;
}

export interface ComponentContext {
    Components: ModelBase[];
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