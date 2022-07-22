import { Component, Input, OnInit } from "@angular/core";
import { ReplaySubject, Subject } from "rxjs";
import { RestService } from "src/app/sdk/rest-service";
import { ContentListViewModelDetail } from "./content-list-detail-view-model";
import { ContentListModelDetail } from "./content-list-model-detail";

@Component({
    templateUrl: "content-list-detail.component.html",
    selector: "app-content-list-detail"
})
export class ContentListDetailComponent implements OnInit {
    @Input() detailModel: ContentListModelDetail | null;
    detailViewModel$: Subject<ContentListViewModelDetail>;

    constructor(private restService: RestService) {
        this.detailViewModel$ = new ReplaySubject<ContentListViewModelDetail>();
        this.detailModel = null;
    }

    ngOnInit() {
        if (!this.detailModel)
            return;

        this.restService.getItem(this.detailModel.DetailItem.ItemType, this.detailModel.DetailItem.Id, this.detailModel.DetailItem.ProviderName).subscribe((x) => {
            if (!this.detailModel)
                return;

            let attributes: { [key: string]: string } = {};
            if (this.detailModel) {
                const attributesForContentList = this.detailModel.Attributes["ContentList"];
                if (attributesForContentList) {
                    attributesForContentList.forEach((pair) => {
                        attributes[pair.Key] = pair.Value;
                    });
                }
            }

            this.detailViewModel$.next({
                Attributes: attributes,
                ViewName: this.detailModel.ViewName,
                DetailItem: x
            })
        });
    }
}
