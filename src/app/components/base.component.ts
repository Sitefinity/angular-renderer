import { Component, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { ModelBase } from "../models/model-base";
import { PageContentService } from "../services/page-content.service";

@Component({ template: '' })
export class BaseComponent<T> implements OnDestroy {
    public Model: ModelBase<T> = {} as ModelBase<T>;

    private subscriptions: Subscription[] = [];

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => {
            s.unsubscribe();
        });
    }

    protected registerSubscription(sub: Subscription) {
        this.subscriptions.push(sub);
    }
}
