import { ModelBase } from "./model-base";

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
