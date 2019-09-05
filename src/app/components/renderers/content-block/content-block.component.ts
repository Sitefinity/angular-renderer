import { Component, OnInit, OnDestroy } from "@angular/core";
import { LazyContentService } from "../../../services/lazy-content.service";
import { ContentBlockProperties, ContentBlockModel, ModelBase } from "../../../common";
import { Subscription } from "rxjs";

@Component({
    templateUrl: "content-block.component.html",
    selector: "app-content"
})
export class ContentComponent extends ContentBlockModel implements OnInit, OnDestroy {
    public Properties: ContentBlockProperties;

    private subscriptions: Subscription[] = [];

    constructor(private lazyService: LazyContentService) {
        super();
    }

    ngOnInit(): void {
        if (this.Lazy) {
            const subscription = this.lazyService.receivedContent$.subscribe((model: ModelBase) => {
                if (model.Id === this.Id) {
                    this.Properties.Content = model.Properties.Content;
                }
            });

            this.subscriptions.push(subscription);
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => {
            s.unsubscribe();
        });
    }
}
