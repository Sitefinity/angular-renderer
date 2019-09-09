import { Component, OnInit } from "@angular/core";
import { PageContentService } from "../services/page-content.service";
import { ActivatedRoute } from "@angular/router";
import { ModelBase } from "../models/model-base";

@Component({
    selector: "app-root",
    templateUrl: "./root.component.html"
})
export class RootComponent implements OnInit {
    public content: ModelBase[];

    constructor(private route: ActivatedRoute,
                private pageContentService: PageContentService) {

    }

    ngOnInit(): void {
        this.route.params.subscribe(r => {
            const pageUrl = r["url"];
            this.pageContentService.get(pageUrl).subscribe(s => {
                this.content = s.ComponentContext.Components;
            });
        });
    }
}
