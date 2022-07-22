import { Component, Input, OnInit } from "@angular/core";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { RestService } from "src/app/sdk/rest-service";
import { SdkItem } from "src/app/sdk/sdk-item";
import { ContentListViewModelDetail } from "./content-list-detail-view-model";
import { ContentListModelDetail } from "./content-list-detail-model";

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

        let queryParams: {[key: string]: string} = {};
        new URLSearchParams(location.search).forEach((val, key) => {
            queryParams[key] = val;
        });

        let item$: Observable<SdkItem>;
        if (queryParams.hasOwnProperty("sf-content-action")) {
            item$ = this.restService.getItemWithStatus(this.detailModel.DetailItem.ItemType, this.detailModel.DetailItem.Id, this.detailModel.DetailItem.ProviderName, queryParams)
        } else {
            item$ = this.restService.getItem(this.detailModel.DetailItem.ItemType, this.detailModel.DetailItem.Id, this.detailModel.DetailItem.ProviderName);
        }

        item$.subscribe((x) => {
            if (!this.detailModel)
                return;

            let attributes: { [key: string]: string } = {};
            if (this.detailModel) {
                if (this.detailModel.Attributes) {
                    this.detailModel.Attributes.forEach((pair) => {
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
