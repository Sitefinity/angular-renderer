import { Component, ViewContainerRef, ViewChild, ComponentFactoryResolver, Renderer, Input, AfterViewInit, OnInit } from "@angular/core";
import { ModelBase } from "../../models/model-base";
import { LayoutComponent } from "./layout/layout.component";
import { ContentComponent } from "./content-block/content-block.component";

@Component({
    template: "<ng-container #componentContainer></ng-container>",
    selector: "app-component-wrapper"
})
export class WrapperComponent implements OnInit {
    public model: ModelBase;

    @Input() componentData: ModelBase;
    @ViewChild("componentContainer", { read: ViewContainerRef, static: true }) viewContainer: ViewContainerRef;

    constructor(private resolver: ComponentFactoryResolver, private renderer: Renderer) {}

    public ngOnInit(): void {
        const type: any = this.componentData.Name === "Layout" ? LayoutComponent : ContentComponent;
        if (!type) {
            return;
        }
        const factory = this.resolver.resolveComponentFactory(type);
        const componentRef = this.viewContainer.createComponent(factory, null, this.viewContainer.injector);
        const componentInstance = componentRef.instance;

        this.setProperties(this.componentData, componentInstance);
    }

    private setProperties(componentData: any, componentInstance: any) {
        if (componentData && componentInstance) {
            Object.keys(componentData).forEach((propName) => {
                componentInstance[propName] = componentData[propName];
            });
        }
    }
}
