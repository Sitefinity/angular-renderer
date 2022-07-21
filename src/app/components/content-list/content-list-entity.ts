export interface ContentListEntity {
    SelectedItems: string;
    SfViewName: string;
    ListSettings: string;
    ListFieldMapping: string;
    OrderBy: string;
    DetailPageMode: "SamePage" | "ExistingPage",
    DetailPage: string;
    SfDetailViewName: string;
    ContentViewDisplayMode: string;
    SelectionGroupLogicalOperator: "AND" | "OR";
    FilterExpression: string;
    SortExpression: string;
    SelectExpression: string;
    DisableCanonicalUrlMetaTag: boolean;
    PagerMode: "URLSegments" | "QueryParameter";
    PagerTemplate: string;
    PagerQueryTemplate: string;
    CssClasses: string;
    ShowListViewOnChildDetailsView: boolean;
    ShowDetailsViewOnChildDetailsView: boolean;
    ShowListViewOnEmptyParentFilter: boolean;
    Attributes: string;
}
