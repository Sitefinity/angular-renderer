import { ModelBase } from "../models/model-base";
import { LayoutComponent } from "../components/layout/layout.component";
import { ContentComponent } from "../components/content-block/content-block.component";
import { Directive, OnInit, ViewContainerRef, Input, ComponentFactoryResolver } from "@angular/core";
import { PageContentService } from "../services/page-content.service";

const TYPES_MAP = {
    Layout: LayoutComponent,
    ContentBlock: ContentComponent
};

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: "[componentWrapper]"
})
export class WrapperComponentDirective implements OnInit {
    @Input("componentWrapper") componentData: ModelBase;

    constructor(private pageContentService: PageContentService,
                private viewContainer: ViewContainerRef,
                private resolver: ComponentFactoryResolver) {}

    public ngOnInit(): void {
        if (!this.componentData) {
            return;
        }

        const type: any = TYPES_MAP[this.componentData.Name];
        if (!type) {
            return;
        }

        if (this.componentData.Lazy) {
            this.pageContentService.receivedContent$.subscribe(model => {
                if (model.Id === this.componentData.Id) {
                    Object.assign(this.componentData, model);

                    this.createAndInjectComponent(type);
                }
            });
        } else {
            this.createAndInjectComponent(type);
        }
    }

    private createAndInjectComponent(type: any) {
        const factory = this.resolver.resolveComponentFactory(type);
        const componentRef = this.viewContainer.createComponent(factory, null, this.viewContainer.injector);
        const componentInstance = componentRef.instance;

        this.setProperties(this.componentData, componentInstance);
    }

    private setProperties(componentData: any, componentInstance: any) {
        if (componentData && componentInstance) {
            Object.keys(componentData).forEach((propName) => {
                componentInstance.Model[propName] = componentData[propName];
            });
        }
    }
}