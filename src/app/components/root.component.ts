import { Component, OnInit } from "@angular/core";
import { PageContentService } from "../services/page-content.service";
import { ActivatedRoute } from "@angular/router";
import { ModelBase } from "../models/model-base";

@Component({
    selector: "rootcmp",
    templateUrl: "./root.component.html"
})
export class RootComponent implements OnInit {
    public content: ModelBase<any>[] = [];
    public culture!: string;
    public siteId!: string;

    constructor(private route: ActivatedRoute,
        private pageContentService: PageContentService) {

    }

    ngOnInit(): void {
        const path = this.route.snapshot.url.map(x => x.path).join("/");
        this.pageContentService.get(path).subscribe(s => {
            this.content = s.ComponentContext.Components;
            this.culture = s.Culture;
            this.siteId = s.SiteId;
        });
    }

    ngAfterViewInit(): void {
        debugger;
    }
}
