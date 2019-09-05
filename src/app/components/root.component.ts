import { Component, OnInit } from "@angular/core";
import { PageContentService } from "../services/page-content.service";
import { LazyContentService } from "../services/lazy-content.service";
import { ActivatedRoute } from "@angular/router";
import { ModelBase } from "../common";

@Component({
    selector: "app-root",
    templateUrl: "./root.component.html"
})
export class RootComponent implements OnInit {
    public content: ModelBase[];

    constructor(private route: ActivatedRoute,
                private pageContentService: PageContentService,
                private lazyContentService: LazyContentService) {

    }

    ngOnInit(): void {
        this.route.params.subscribe(r => {
            const pageUrl = r["url"];
            this.pageContentService.get(pageUrl).subscribe(s => {
                this.content = s.ComponentContext.Components;

                if (s.ComponentContext.HasLazyComponents) {
                    this.lazyContentService.get(pageUrl).subscribe(lazy => {
                        lazy.Components.forEach(c => {
                            this.lazyContentService.sendContent(c);
                        });
                    });
                }
            });
        });
    }
}
