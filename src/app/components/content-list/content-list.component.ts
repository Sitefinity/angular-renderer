import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../base.component";
import { RenderContext } from "src/app/services/render-context";
import { ContentListEntity } from "./content-list-entity";

@Component({
    templateUrl: "content-list.component.html",
    selector: "app-content"
})
export class ContentListComponent extends BaseComponent<ContentListEntity> implements OnInit {
    constructor(private renderContext: RenderContext) {
        super();
    }

    ngOnInit() {

    }
}
