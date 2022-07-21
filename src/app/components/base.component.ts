import { Component, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { ModelBase } from "../models/model-base";

@Component({ template: '' })
export class BaseComponent<T> implements OnDestroy {
    public Model: ModelBase<T> = {} as ModelBase<T>;
    public get Properties(): T {
        return this.Model.Properties;
    }

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
