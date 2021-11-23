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

    constructor(renderContext: RenderContext, private rendererService: RendererContractImpl, private route: ActivatedRoute,
        private pageContentService: PageContentService) {
        if (renderContext.isEdit()) {
            const rendererContract = (window as any)["rendererContract"] as RendererContractImpl;
            rendererContract.getWidgetMetadata = rendererService.getWidgetMetadata;
            rendererContract.getCategories = rendererService.getCategories;
            rendererContract.getWidgets = rendererService.getWidgets;
            rendererContract.renderWidget = rendererService.renderWidget;
            rendererContract.ready = rendererService.ready;
        }
    }

    ngOnInit(): void {
        const path = window.location.pathname;
        this.pageContentService.get(path).subscribe(s => {
            this.content = s.ComponentContext.Components;
        });

        window.setTimeout(() => {
            (window as any)["rendererContract"].resolveFunc();
        }, 500);
    }

    ngAfterViewInit(): void {
    }
}
