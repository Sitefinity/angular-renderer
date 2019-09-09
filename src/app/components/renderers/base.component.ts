import { OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { ModelBase } from "../../models/model-base";
import { ODataEntityResponse } from "../../models/service-response";
import { PageContentService } from "../../services/page-content.service";

export class BaseClass<T extends ModelBase> implements OnInit, OnDestroy {
    public Model: T = {} as T;
    private subscriptions: Subscription[] = [];
    protected pageContentService: PageContentService;

    constructor(pageContentService: PageContentService) {
        this.pageContentService = pageContentService;
    }

    ngOnInit(): void {
        if (this.Model.Lazy) {
            const subscription = this.pageContentService.receivedContent$.subscribe((model: ModelBase) => {
                if (model.Id === this.Model.Id) {
                    this.Model.Properties.Content = model.Properties.Content;
                }
            });

            this.subscriptions.push(subscription);
        }

        if (this.Model.Properties && this.Model.Properties.SharedContentID && this.Model.Properties.ProviderName) {
            const sub = this.pageContentService.getShared(this.Model.Properties.SharedContentID, this.Model.Properties.ProviderName)
                            .subscribe((response: ODataEntityResponse) => {
                this.Model.Properties.Content = response.Content;
            });

            this.subscriptions.push(sub);
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => {
            s.unsubscribe();
        });
    }
}
