import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { RestService } from "src/app/sdk/services/rest.service";
import { SdkItem } from "src/app/sdk/sdk-item";
import { ContentListViewModelDetail } from "./content-list-detail-view-model";
import { ContentListModelDetail } from "./content-list-detail-model";

@Component({
    templateUrl: "content-list-detail.component.html",
    selector: "app-content-list-detail"
})
export class ContentListDetailComponent implements OnChanges {
    @Input() detailModel: ContentListModelDetail | null;
    detailViewModel$: Subject<ContentListViewModelDetail>;

    constructor(private restService: RestService) {
        this.detailViewModel$ = new ReplaySubject<ContentListViewModelDetail>();
        this.detailModel = null;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes["detailModel"].currentValue !== changes["detailModel"].previousValue) {
            const currentValue: ContentListModelDetail = changes["detailModel"].currentValue;
            if (!currentValue)
                return;

            let queryParams: { [key: string]: string } = {};
            new URLSearchParams(location.search).forEach((val, key) => {
                queryParams[key] = val;
            });

            let item$: Observable<SdkItem>;
            if (queryParams.hasOwnProperty("sf-content-action")) {
                item$ = this.restService.getItemWithStatus(currentValue.DetailItem.ItemType, currentValue.DetailItem.Id, currentValue.DetailItem.ProviderName, queryParams)
            } else {
                item$ = this.restService.getItem(currentValue.DetailItem.ItemType, currentValue.DetailItem.Id, currentValue.DetailItem.ProviderName);
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
}
