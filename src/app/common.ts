export interface PageContentServiceResponse {
    ComponentContext: { Components: ModelBase[], HasLazyComponents: boolean };
}

export class ModelBase {
    Id: string;
    Lazy: boolean;
    Children: ModelBase[];
    Caption: string;
    PlaceHolder: string;
    Name: any;
    Properties: any;
}

export class ContainerModel extends ModelBase {
    Name: "Layout";
    Properties: [{ [key: string]: string }];
    ViewName: string;
}

export class ContentBlockModel extends ModelBase {
    Name: "ContentBlock";
    Properties: ContentBlockProperties;
}

export class ContentBlockProperties {
    Content: string;
    ExcludeFromSearchIndex: boolean;
    ProviderName: string;
    SharedContentID: string;
    WrapperCssClass: string;
}

export const LayoutColumns = {
    "1-column": 1,
    "2-columns": 2,
    "3-columns": 3,
    "4-columns": 4,
    "5-columns": 5,
    "6-columns": 6,
};
