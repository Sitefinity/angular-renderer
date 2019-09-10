import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { PageContentService } from "../../services/page-content.service";
import { ModelBase } from "../../models/model-base";
import { ContentBlockModel } from "../../models/content-block-model";
import { ODataEntityResponse } from "../../models/service-response";
import { BaseComponent } from "../base.component";

@Component({
    templateUrl: "content-block.component.html",
    selector: "app-content"
})
export class ContentComponent extends BaseComponent<ContentBlockModel> implements OnInit {
    constructor(protected pageContentService: PageContentService) {
        super(pageContentService);
    }

    ngOnInit() {
        if (this.Model.Properties && this.Model.Properties.SharedContentID && this.Model.Properties.ProviderName) {
            const sub = this.pageContentService.getShared(this.Model.Properties.SharedContentID, this.Model.Properties.ProviderName)
                            .subscribe((response: ODataEntityResponse) => {
                this.Model.Properties.Content = response.Content;
            });

            this.registerSubscription(sub);
        }
    }
}
