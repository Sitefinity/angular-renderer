import { Component, OnInit } from "@angular/core";
import { PageContentService } from "../../services/page-content.service";
import { ContentBlockEntity } from "../../models/content-block-entity";
import { ODataEntityResponse } from "../../models/service-response";
import { BaseComponent } from "../base.component";
import { RenderContext } from "src/app/services/render-context";

@Component({
    templateUrl: "content-block.component.html",
    selector: "app-content"
})
export class ContentComponent extends BaseComponent<ContentBlockEntity> implements OnInit {
    constructor(private pageContentService: PageContentService, private renderContext: RenderContext) {
        super();
    }

    ngOnInit() {
        if (this.Model.Properties && this.Model.Properties.SharedContentID) {
            const sub = this.pageContentService.getShared(this.Model.Properties.SharedContentID, this.renderContext.cultureName)
                            .subscribe((response: ODataEntityResponse) => {
                this.Model.Properties.Content = response.Content;
            });

            this.registerSubscription(sub);
        }
    }
}
