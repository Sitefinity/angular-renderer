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

            if (this.renderContext.isEdit()) {
                window.document.body.setAttribute('data-sfcontainer', '');
                const handle = window.setInterval(() => {
                    // we do not know the exact time when angular has finished the rendering process.
                    // thus we check every 100ms for dom changes. A proper check would be to see if every single
                    // component is rendered
                    if ((this.content.length > 0 && window.document.body.childElementCount > 0) || this.content.length === 0) {
                        window.clearInterval(handle);

                        (window as any)["rendererContract"] = this.rendererService;
                        window.dispatchEvent(new Event('contractReady'));
                    }
                }, 100);
            }
        });
    }
}
