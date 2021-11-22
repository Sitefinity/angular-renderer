export class RendererContractImpl implements RendererContract {
    private resolveFunc: any;

    getWidgetMetadata(args: GetWidgetMetadataArgs): Promise<ComponentMetadata> {
        return Promise.resolve(<any>{ "Name": "ContentBlock", "Caption": "Content block", "PropertyMetadata": [{ "Name": "Basic", "Sections": [{ "Name": "Main", "Title": null, "Properties": [{ "Name": "Content", "DefaultValue": null, "Title": "Content", "Type": "html", "SectionName": null, "CategoryName": null, "Properties": { "Meta_DynamicLinksContainer_HasLinks": "True" }, "TypeChildProperties": [], "Position": 0 }, { "Name": "ProviderName", "DefaultValue": null, "Title": "ProviderName", "Type": "string", "SectionName": null, "CategoryName": null, "Properties": {}, "TypeChildProperties": [], "Position": 0 }, { "Name": "SharedContentID", "DefaultValue": null, "Title": "SharedContentID", "Type": "uuid", "SectionName": null, "CategoryName": null, "Properties": {}, "TypeChildProperties": [], "Position": 0 }], "CategoryName": "Basic" }] }, { "Name": "Advanced", "Sections": [{ "Name": "AdvancedMain", "Title": null, "Properties": [{ "Name": "SfWidgetLabel", "DefaultValue": "Content block", "Title": "Label", "Type": null, "SectionName": null, "CategoryName": "Advanced", "Properties": { "Meta_Description_Description": "Custom labels are displayed in the page editor for your convenience. You can change the generic name with a specific one only for this widget.", "Meta_MaxLength_Length": "30" }, "TypeChildProperties": [], "Position": 0 }, { "Name": "WrapperCssClass", "DefaultValue": null, "Title": "Wrapper CSS class", "Type": "string", "SectionName": null, "CategoryName": "Advanced", "Properties": {}, "TypeChildProperties": [], "Position": 0 }, { "Name": "TagName", "DefaultValue": "div", "Title": "Tag name", "Type": "string", "SectionName": null, "CategoryName": "Advanced", "Properties": {}, "TypeChildProperties": [], "Position": 0 }], "CategoryName": "Advanced" }, { "Name": "Display settings", "Title": "Display settings", "Properties": [{ "Name": "Margins", "DefaultValue": null, "Title": "Margins", "Type": "complex", "SectionName": "Display settings", "CategoryName": "Advanced", "Properties": { "Meta_TableView_ColumnTitle": "Content", "Meta_TableView_Enabled": "True" }, "TypeChildProperties": [{ "Name": "Top", "DefaultValue": "None", "Title": "Top", "Type": "chipchoice", "SectionName": null, "CategoryName": null, "Properties": { "Meta_Choices": "[{\u0022Title\u0022:\u0022None\u0022,\u0022Name\u0022:\u0022None\u0022,\u0022Value\u0022:\u0022None\u0022,\u0022Icon\u0022:null},{\u0022Title\u0022:\u0022Small\u0022,\u0022Name\u0022:\u0022S\u0022,\u0022Value\u0022:\u0022S\u0022,\u0022Icon\u0022:null},{\u0022Title\u0022:\u0022Medium\u0022,\u0022Name\u0022:\u0022M\u0022,\u0022Value\u0022:\u0022M\u0022,\u0022Icon\u0022:null},{\u0022Title\u0022:\u0022Large\u0022,\u0022Name\u0022:\u0022L\u0022,\u0022Value\u0022:\u0022L\u0022,\u0022Icon\u0022:null}]", "Meta_Choices_AllowMultiple": "False" }, "TypeChildProperties": [], "Position": 0 }, { "Name": "Bottom", "DefaultValue": "None", "Title": "Bottom", "Type": "chipchoice", "SectionName": null, "CategoryName": null, "Properties": { "Meta_Choices": "[{\u0022Title\u0022:\u0022None\u0022,\u0022Name\u0022:\u0022None\u0022,\u0022Value\u0022:\u0022None\u0022,\u0022Icon\u0022:null},{\u0022Title\u0022:\u0022Small\u0022,\u0022Name\u0022:\u0022S\u0022,\u0022Value\u0022:\u0022S\u0022,\u0022Icon\u0022:null},{\u0022Title\u0022:\u0022Medium\u0022,\u0022Name\u0022:\u0022M\u0022,\u0022Value\u0022:\u0022M\u0022,\u0022Icon\u0022:null},{\u0022Title\u0022:\u0022Large\u0022,\u0022Name\u0022:\u0022L\u0022,\u0022Value\u0022:\u0022L\u0022,\u0022Icon\u0022:null}]", "Meta_Choices_AllowMultiple": "False" }, "TypeChildProperties": [], "Position": 0 }], "Position": 1 }], "CategoryName": "Advanced" }] }], "PropertyMetadataFlat": [{ "Name": "Content", "DefaultValue": null, "Title": "Content", "Type": "html", "SectionName": null, "CategoryName": null, "Properties": { "Meta_DynamicLinksContainer_HasLinks": "True" }, "TypeChildProperties": [], "Position": 0 }, { "Name": "ProviderName", "DefaultValue": null, "Title": "ProviderName", "Type": "string", "SectionName": null, "CategoryName": null, "Properties": {}, "TypeChildProperties": [], "Position": 0 }, { "Name": "SharedContentID", "DefaultValue": null, "Title": "SharedContentID", "Type": "uuid", "SectionName": null, "CategoryName": null, "Properties": {}, "TypeChildProperties": [], "Position": 0 }, { "Name": "SfWidgetLabel", "DefaultValue": "Content block", "Title": "Label", "Type": null, "SectionName": null, "CategoryName": "Advanced", "Properties": { "Meta_Description_Description": "Custom labels are displayed in the page editor for your convenience. You can change the generic name with a specific one only for this widget.", "Meta_MaxLength_Length": "30" }, "TypeChildProperties": [], "Position": 0 }, { "Name": "WrapperCssClass", "DefaultValue": null, "Title": "Wrapper CSS class", "Type": "string", "SectionName": null, "CategoryName": "Advanced", "Properties": {}, "TypeChildProperties": [], "Position": 0 }, { "Name": "TagName", "DefaultValue": "div", "Title": "Tag name", "Type": "string", "SectionName": null, "CategoryName": "Advanced", "Properties": {}, "TypeChildProperties": [], "Position": 0 }, { "Name": "Margins", "DefaultValue": null, "Title": "Margins", "Type": "complex", "SectionName": "Display settings", "CategoryName": "Advanced", "Properties": { "Meta_TableView_ColumnTitle": "Content", "Meta_TableView_Enabled": "True" }, "TypeChildProperties": [{ "Name": "Top", "DefaultValue": "None", "Title": "Top", "Type": "chipchoice", "SectionName": null, "CategoryName": null, "Properties": { "Meta_Choices": "[{\u0022Title\u0022:\u0022None\u0022,\u0022Name\u0022:\u0022None\u0022,\u0022Value\u0022:\u0022None\u0022,\u0022Icon\u0022:null},{\u0022Title\u0022:\u0022Small\u0022,\u0022Name\u0022:\u0022S\u0022,\u0022Value\u0022:\u0022S\u0022,\u0022Icon\u0022:null},{\u0022Title\u0022:\u0022Medium\u0022,\u0022Name\u0022:\u0022M\u0022,\u0022Value\u0022:\u0022M\u0022,\u0022Icon\u0022:null},{\u0022Title\u0022:\u0022Large\u0022,\u0022Name\u0022:\u0022L\u0022,\u0022Value\u0022:\u0022L\u0022,\u0022Icon\u0022:null}]", "Meta_Choices_AllowMultiple": "False" }, "TypeChildProperties": [], "Position": 0 }, { "Name": "Bottom", "DefaultValue": "None", "Title": "Bottom", "Type": "chipchoice", "SectionName": null, "CategoryName": null, "Properties": { "Meta_Choices": "[{\u0022Title\u0022:\u0022None\u0022,\u0022Name\u0022:\u0022None\u0022,\u0022Value\u0022:\u0022None\u0022,\u0022Icon\u0022:null},{\u0022Title\u0022:\u0022Small\u0022,\u0022Name\u0022:\u0022S\u0022,\u0022Value\u0022:\u0022S\u0022,\u0022Icon\u0022:null},{\u0022Title\u0022:\u0022Medium\u0022,\u0022Name\u0022:\u0022M\u0022,\u0022Value\u0022:\u0022M\u0022,\u0022Icon\u0022:null},{\u0022Title\u0022:\u0022Large\u0022,\u0022Name\u0022:\u0022L\u0022,\u0022Value\u0022:\u0022L\u0022,\u0022Icon\u0022:null}]", "Meta_Choices_AllowMultiple": "False" }, "TypeChildProperties": [], "Position": 0 }], "Position": 1 }] });
    }

    renderWidget(args: RenderWidgetArgs): Promise<RenderResult> {
        window.location.reload();
        return Promise.resolve({
            content: "",
            scripts: []
        });
    }

    getCategories(args: GetCategoriesArgs): Promise<string[]> {
        return Promise.resolve(["Content", "Layout"]);
    }

    getWidgets(args: GetWidgetsArgs): Promise<TotalCountResult<WidgetSection[]>> {
        return Promise.resolve({
            totalCount: 1,
            dataItems: [
                {
                    title: "Basic",
                    widgets: [
                        {
                            name: "Content",
                            addWidgetName: "Content",
                            addWidgetTitle: "Content block",
                            title: "Content block",
                            initialProperties: []
                        }
                    ]
                }
            ]
        });
    }

    ready(): Promise<void> {
        var that = this;
        return new Promise((resolve, reject) => {
            that.resolveFunc = resolve;
        });
    }

    setReady() {
        this.resolveFunc();
    }
}


export interface RendererContract {
    getWidgetMetadata(args: GetWidgetMetadataArgs): Promise<ComponentMetadata>;
    renderWidget(args: RenderWidgetArgs): Promise<RenderResult>;
    getCategories(args: GetCategoriesArgs): Promise<Array<string>>;
    getWidgets(args: GetWidgetsArgs): Promise<TotalCountResult<Array<WidgetSection>>>;
    ready(): Promise<void>;
}

export interface TotalCountResult<T> {
    dataItems: T;
    totalCount: number;
}

export interface RenderResult {
    content: string,
    scripts: Array<Script>
}

export interface Script {
    src: string;
    id: string;
}

export interface RenderResult {
    content: string,
    scripts: Array<Script>
}

export interface Script {
    src: string;
    id: string;
}

export interface WidgetItem {
    name: string;
    title: string;
    addWidgetTitle: string;
    addWidgetName: string;
    initialProperties: Array<{ name: string, value: string}>
}

export interface WidgetSection {
    title: string;
    widgets: WidgetItem[];
}

export interface RenderWidgetArgs {
    dataItem: DataItem;
    siteId: string;
    model: WidgetModel;
    token?: Token;
}
export interface GetCategoriesArgs {
    token?: Token;
    toolbox?: string;
}

export interface GetWidgetsArgs {
    dataItem: DataItem;
    category: string;
    search: string;
    skip: number;
    take: number;
    token?: Token;
    toolbox?: string;
}

export interface GetWidgetMetadataArgs {
    dataItem: DataItem;
    widgetKey: string;
    widgetName: string;
    siteId: string;
    token?: Token;
}

export interface ComponentMetadata {
    Caption: string,
    Name: string,
    PropertyMetadata: SectionGroup[],
    PropertyMetadataFlat: PropertyMetadata[],
}

export interface PropertyMetadata {
    Name: string;
    Title: string;
    Type: string;
    DefaultValue: string;
    Properties: { [key: string]: any }
}

export interface SectionGroup {
    Name: string;

    Sections: SectionData[];
}

export interface SectionData {
    /**
     * The section name
     *
     * @memberof {SectionData}
     */
      Name: string,

    /**
     * The section title
     *
     * @memberof {SectionData}
     */
      Title: string

    /**
     * Collection of properties
     *
     * @memberof {SectionData}
     */
      Properties: Array<PropertyMetadata>
}


export interface WidgetModel {
    Id: string;
    Name: string;
    Properties: any;
}

export interface Token {
    type: string,
    value: string
}

export interface DataItem {
    readonly provider: string;
    /**
     * Gets the assigned culture of the item.
     */
    readonly culture: string;

    /**
     * Gets the identifier of the item. Returns null if there is no item.
     */
    readonly key: string;
}
