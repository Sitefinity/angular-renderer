import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../base.component";
import { ContentListEntity } from "./content-list-entity";
import { ContentListViewModel } from "./content-list-view-model";
import { ContentListModelDetail } from "./detail/content-list-detail-model";
import { DetailItem } from "src/app/services/detail-item";
import { ContentListModelMaster } from "./master/content-list-master-model";

@Component({
    templateUrl: "content-list.component.html",
    selector: "app-content-list"
})
export class ContentListComponent extends BaseComponent<ContentListEntity> implements OnInit {
    viewModel: ContentListViewModel | undefined;
    detailModel: ContentListModelDetail | undefined;

    constructor() {
        super();

        this.Metadata.Title = "Content list";
        this.Metadata.EmptyIconText = "Select content";
        this.Metadata.EmptyIcon = "plus-circle";
    }

    ngOnInit() {
        this.Properties.DetailPageMode = this.Properties.DetailPageMode || "SamePage";
        this.Properties.ContentViewDisplayMode = this.Properties.ContentViewDisplayMode || "Automatic";
        this.Properties.Attributes = this.Properties.Attributes || {};
        this.Properties.CssClasses = this.Properties.CssClasses || [];
        this.Properties.ListFieldMapping = this.Properties.ListFieldMapping || {};

        if (this.Properties.ContentViewDisplayMode === "Automatic") {
            if (this.RequestContext.DetailItem) {
                this.handleDetailView(this.RequestContext.DetailItem);
            } else {
                this.handleListView();
            }
        } else if (this.Properties.ContentViewDisplayMode === "Detail" && this.Properties.DetailPageMode === "SamePage") {
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

    private handleListView() {
        let contnetListMasterModel: ContentListModelMaster = {
            RenderLinks: !(this.Properties.ContentViewDisplayMode === "Master" && this.Properties.DetailPageMode === "SamePage"),
            FieldCssClassMap: {},
            FieldMap: {}
        };

        this.Properties.ListFieldMapping.forEach((entry) => {
            contnetListMasterModel.FieldMap[entry.FriendlyName] = entry.Name;
        });

        this.Properties.CssClasses.forEach((entry) => {
            contnetListMasterModel.FieldCssClassMap[entry.FieldName] = entry.CssClass;
        });
    }

    private handleDetailView(detailItem: DetailItem) {
        const detailsViewCss = this.Properties.CssClasses.find(x => x.FieldName === "Details view");
        const contentListAttributes = this.Properties.Attributes["ContentList"];
        if (detailsViewCss && contentListAttributes) {
            const classAttribute = contentListAttributes.find(x => x.Key === "class");
            if (!classAttribute) {
                contentListAttributes.push({
                    Key: "class",
                    Value: detailsViewCss.CssClass
                });
            } else {
                classAttribute.Value += ` ${detailsViewCss.CssClass}`;
            }
        }

        this.detailModel = {
            Attributes: this.Properties.Attributes["ContentList"],
            DetailItem: detailItem,
            ViewName: this.Properties.SfDetailViewName
        };
    }
}
