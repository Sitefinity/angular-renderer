import { Component } from "@angular/core";
import { Meta } from "@angular/platform-browser";
import { ComponentContainer } from "./directives/component-wrapper.directive";
import { PageLayoutServiceResponse } from "./models/service-response";
import { ServiceMetadata } from "./sdk/service-metadata";
import { LayoutService } from "./sdk/services/layout.service";
import { RenderContext } from "./services/render-context";
import { RendererContractImpl } from "./editor/renderer-contract";

@Component({
    selector: "body",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent {
    public content: ComponentContainer[] = [];

    constructor(
        private serviceMetadata: ServiceMetadata,
        private meta: Meta,
        private renderContext: RenderContext,
        private rendererService: RendererContractImpl,
        private layoutService: LayoutService) {

    }

    ngOnInit(): void {
        this.serviceMetadata.fetch().subscribe(() => {
            this.layoutService.get(window.location.href).subscribe(s => {
                this.renderContext.cultureName = s.Culture;
                this.content = s.ComponentContext.Components.map(x => {
                    return <ComponentContainer>{
                        model: x,
                        context: {
                            DetailItem: s.DetailItem
                        }
                    }
                });

                if (s.UrlParameters.length > 0 && !s.DetailItem) {
                    // this.router.navigate(["404"]);
                    this.fireEventForEditor();
                    return;
                }

                window.document.body.classList.add("container-fluid");
                this.fireEventForEditor();
                this.renderMetaInfo(s);
            });
        });
    }
    private fireEventForEditor() {

        if (this.renderContext.isEdit()) {
            window.document.body.setAttribute('data-sfcontainer', 'Body');
            const timeout = 2000;
            const start = new Date().getTime();
            const handle = window.setInterval(() => {
                // we do not know the exact time when angular has finished the rendering process.
                // thus we check every 100ms for dom changes. A proper check would be to see if every single
                // component is rendered
                const timePassed = new Date().getTime() - start;
                if ((this.content.length > 0 && window.document.body.childElementCount > 0) || this.content.length === 0 || timePassed > timeout) {
                    window.clearInterval(handle);

                    (window as any)["rendererContract"] = this.rendererService;
                    window.dispatchEvent(new Event('contractReady'));
                }
            }, 100);
        }
    }

    private renderMetaInfo(s: PageLayoutServiceResponse) {
        document.title = s.MetaInfo.Title;

        const metaMap = {
            "og:title": s.MetaInfo.OpenGraphTitle,
            "og:image": s.MetaInfo.OpenGraphImage,
            "og:video": s.MetaInfo.OpenGraphVideo,
            "og:type": s.MetaInfo.OpenGraphType,
            "og:description": s.MetaInfo.OpenGraphDescription,
            "og:site": s.MetaInfo.OpenGraphSite,
        }

        Object.keys(metaMap).forEach((key) => {
            const val = (<any>metaMap)[key];
            if (val) {
                this.meta.addTag({ property: key, content: val });
            }
        });

        if (s.MetaInfo.Description) {
            this.meta.addTag({ name: "description", content: s.MetaInfo.Description });
        }

        if (s.MetaInfo.CanonicalUrl) {
            const linkElement = document.createElement("link");
            linkElement.setAttribute("rel", "canonical");
            linkElement.setAttribute("href", s.MetaInfo.CanonicalUrl);
            document.head.appendChild(linkElement);
        }
    }
}
