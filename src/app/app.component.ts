import { Component, ViewContainerRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ModelBase } from "./models/model-base";
import { PageContentService } from "./services/page-content.service";
import { RenderContext } from "./services/render-context";
import { RendererContractImpl } from "./services/renderer-contract";

@Component({
    selector: "body",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent {
    title = "sf-pages-sample-apps";
    public content: ModelBase<any>[] = [];

    constructor(private renderContext: RenderContext, private rendererService: RendererContractImpl, private pageContentService: PageContentService) {

    }

    ngOnInit(): void {
        const path = window.location.pathname;
        this.pageContentService.get(path).subscribe(s => {
            this.content = s.ComponentContext.Components;
        });

        window.setTimeout(() => {
            if (this.renderContext.isEdit()) {
                (window as any)["rendererContract"] = this.rendererService;
                window.dispatchEvent(new Event('contractReady'));
            }
        }, 500);
    }

    ngAfterViewInit(): void {
    }
}
