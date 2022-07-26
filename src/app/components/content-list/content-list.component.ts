import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../base.component";
import { ContentListEntity } from "./content-list-entity";
import { ContentListModelDetail } from "./detail/content-list-detail-model";
import { DetailItem } from "src/app/services/detail-item";
import { ContentListModelMaster } from "./master/content-list-master-model";
import { ContentListRestService } from "./content-list-rest.service";
import { SdkItem } from "src/app/sdk/sdk-item";
import { RestSdkTypes, RestService } from "src/app/sdk/services/rest.service";
import { PageItem } from "src/app/sdk/page-item";

@Component({
    templateUrl: "content-list.component.html",
    selector: "app-content-list"
})
export class ContentListComponent extends BaseComponent<ContentListEntity> implements OnInit {
    detailModel: ContentListModelDetail | undefined;
    listModel: ContentListModelMaster | undefined;

    constructor(private contentlistService: ContentListRestService, private restService: RestService) {
        super();

        this.Metadata.Title = "Content list";
        this.Metadata.EmptyIconText = "Select content";
        this.Metadata.EmptyIcon = "plus-circle";
    }

    ngOnInit() {
        window.addEventListener('popstate', ((ev) => {
            if (this.detailModel) {
                this.detailModel = undefined;
            } else if (ev.state && ev.state.hasOwnProperty("Id")) {
                this.handleDetailView(<DetailItem>ev.state);
            }
        }));

        this.Properties.DetailPageMode = this.Properties.DetailPageMode || "SamePage";
        this.Properties.ContentViewDisplayMode = this.Properties.ContentViewDisplayMode || "Automatic";
        this.Properties.Attributes = this.Properties.Attributes || {};
        this.Properties.CssClasses = this.Properties.CssClasses || [];
        this.Properties.ListFieldMapping = this.Properties.ListFieldMapping || {};
        this.Properties.OrderBy = this.Properties.OrderBy || "PublicationDate DESC";
        this.Properties.ListSettings = this.Properties.ListSettings || {};
        this.Properties.ListSettings.DisplayMode = this.Properties.ListSettings.DisplayMode || "All";
        this.Properties.ListSettings.ItemsPerPage = this.Properties.ListSettings.ItemsPerPage || 20;
        this.Properties.ListSettings.LimitItemsCount = this.Properties.ListSettings.LimitItemsCount || 20;
        this.Properties.SelectExpression = this.Properties.SelectExpression || "*";
        this.Properties.SelectionGroupLogicalOperator = this.Properties.SelectionGroupLogicalOperator || "AND";

        if (this.Properties.ContentViewDisplayMode === "Automatic") {
            if (this.RequestContext.DetailItem) {
                this.handleDetailView(this.RequestContext.DetailItem);
            } else {
                this.handleListView();
            }
        } else if (this.Properties.ContentViewDisplayMode === "Detail") {
            if (this.Properties.SelectedItems && this.Properties.SelectedItems.Content && this.Properties.SelectedItems.Content.length > 0) {
                const selectedContent = this.Properties.SelectedItems.Content[0];
                this.handleDetailView({
                    Id: this.Properties.SelectedItems.ItemIdsOrdered[0],
                    ItemType: selectedContent.Type,
                    ProviderName: selectedContent.Variations[0].Source
                });
            }
        } else if (this.Properties.ContentViewDisplayMode === "Master") {
            this.handleListView();
        }
    }

    public onDetailItemOpenHandler(item: SdkItem) {
        const selectedContent = this.Properties.SelectedItems.Content[0];
        const detailItem: DetailItem = {
            Id: item.Id,
            ProviderName: item.Provider,
            ItemType: selectedContent.Type
        };

        if (this.Properties.DetailPageMode === "SamePage") {
            this.handleDetailView(detailItem);

            const newUrl = window.location.origin + window.location.pathname + item.ItemDefaultUrl + window.location.search;
            window.history.pushState(detailItem, '', newUrl);
        } else if (this.Properties.DetailPage) {
            this.restService.getItem(RestSdkTypes.Pages, this.Properties.DetailPage.ItemIdsOrdered[0], this.Properties.DetailPage.Content[0].Variations[0].Source).subscribe((page: SdkItem) => {
                const newUrl = (page as PageItem).ViewUrl + item.ItemDefaultUrl;
                window.location.href = newUrl;
            });
        }
    }

    private handleListView() {
        const listFieldMapping: {[key: string]: string} = {};
        this.Properties.ListFieldMapping.forEach((entry) => {
            listFieldMapping[entry.FriendlyName] = entry.Name;
        });

        const fieldCssClassMap: {[key: string]: string} = {};
        this.Properties.CssClasses.forEach((entry) => {
            fieldCssClassMap[entry.FieldName] = entry.CssClass;
        });

        const items = this.contentlistService.getItems(this.Properties, this.RequestContext.DetailItem);

        let contnetListMasterModel: ContentListModelMaster = {
            OpenDetails: !(this.Properties.ContentViewDisplayMode === "Master" && this.Properties.DetailPageMode === "SamePage"),
            FieldCssClassMap: fieldCssClassMap,
            FieldMap: listFieldMapping,
            Items$: items,
            ViewName: this.Properties.SfViewName,
            Attributes: this.getAttributesWithClasses("Content list", "row row-cols-1 row-cols-md-3")
        };

        this.listModel = contnetListMasterModel;
    }

    private handleDetailView(detailItem: DetailItem) {
        const contentListAttributes = this.getAttributesWithClasses("Details view", null);

        this.detailModel = {
            Attributes: contentListAttributes,
            DetailItem: detailItem,
            ViewName: this.Properties.SfDetailViewName
        };
    }

    private getAttributesWithClasses(fieldName: string, additiinalClasses: string | null): Array<{ Key: string, Value: string}> {
        const viewCss = this.Properties.CssClasses.find(x => x.FieldName === fieldName);

        const contentListAttributes = this.Properties.Attributes["ContentList"];
        let classAttribute = contentListAttributes.find(x => x.Key === "class");
        if (!classAttribute) {
            classAttribute = {
                Key: "class",
                Value: ''
            };

            contentListAttributes.push(classAttribute);
        }

        if (viewCss) {
            classAttribute.Value += ` ${viewCss.CssClass}`;
        }

        if (additiinalClasses)
            classAttribute.Value += ` ${additiinalClasses}`;

        return contentListAttributes;
    }
}
