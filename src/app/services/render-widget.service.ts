import { ComponentFactoryResolver, Injectable, Renderer2, Type, ViewContainerRef } from "@angular/core";
import { BaseComponent } from "../components/base.component";
import { ContentComponent } from "../components/content-block/content-block.component";
import { ModelBase } from "../models/model-base";
import { RenderContext } from "./render-context";
import { ComponentMetadata, WidgetModel } from "./renderer-contract";

const TYPES_MAP: { [key: string]: Function } = {
    ContentBlock: ContentComponent
};

@Injectable()
export class RenderWidgetService {
    constructor(private resolver: ComponentFactoryResolver, private renderContext: RenderContext, private renderer: Renderer2) {

    }

    public createAndInjectComponent(widgetModel: WidgetModel, viewContainer: ViewContainerRef) {
        const type: any = TYPES_MAP[widgetModel.Name];
        if (!type) {
            return;
        }

        const factory = this.resolver.resolveComponentFactory(type);
        const componentRef = viewContainer.createComponent(factory, undefined, viewContainer.injector);
        const componentInstance = componentRef.instance as BaseComponent<ModelBase<any>>;

        if (this.renderContext.isEdit()) {
            this.renderer.setAttribute(componentRef.location.nativeElement, "component", widgetModel.Name);
        }

        this.setProperties(widgetModel, componentInstance);

        return componentInstance;
    }

    private setProperties(componentData: WidgetModel, componentInstance: BaseComponent<ModelBase<any>>) {
        if (componentData && componentInstance) {
            Object.keys(componentData).forEach((propName) => {
                (componentInstance.Model as any)[propName] = componentData.Properties[propName];
            });
        }
    }
}
