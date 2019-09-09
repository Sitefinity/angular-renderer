import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { PageContentService } from "../../../services/page-content.service";
import { ModelBase } from "../../../models/model-base";
import { ContentBlockModel, ContentBlockProperties } from "../../../models/content-block-model";
import { ODataEntityResponse } from "../../../models/service-response";
import { BaseClass } from "../base.component";

@Component({
    templateUrl: "content-block.component.html",
    selector: "app-content"
})
export class ContentComponent extends BaseClass<ContentBlockModel> implements OnInit, OnDestroy {
    constructor(protected pageContentService: PageContentService) {
        super(pageContentService);
    }
}
