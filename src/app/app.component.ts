import { Component, ViewContainerRef } from "@angular/core";
import { RenderContext } from "./services/render-context";
import { RenderWidgetService } from "./services/render-widget.service";
import { RendererContractImpl } from "./services/renderer-contract";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent {
    title = "sf-pages-sample-apps";
    constructor(renderContext: RenderContext, rendererService: RendererContractImpl) {
        if (renderContext.isEdit()) {
            (window as any)["rendererContract"] = rendererService;
        }
    }
}
