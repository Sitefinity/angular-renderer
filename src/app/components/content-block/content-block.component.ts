import { Component, OnInit } from "@angular/core";
import { ContentBlockEntity } from "./content-block-entity";
import { ODataEntityResponse } from "../../models/service-response";
import { BaseComponent } from "../base.component";
import { RenderContext } from "src/app/services/render-context";
import { RestService } from "src/app/sdk/services/rest.service";
import { GenericContentItem } from "src/app/sdk/generic-content-item";

@Component({
    templateUrl: "content-block.component.html",
    selector: "app-content"
})
export class ContentComponent extends BaseComponent<ContentBlockEntity> implements OnInit {
    constructor(private restService: RestService, private renderContext: RenderContext) {
        super();
    }

    ngOnInit() {
        if (this.Model.Properties && this.Model.Properties.SharedContentID) {
            const sub = this.restService.getSharedContent(this.Model.Properties.SharedContentID, this.renderContext.cultureName)
                            .subscribe((response) => {
                this.Model.Properties.Content = response.Content;
            });

            this.registerSubscription(sub);
        }
    }
}
