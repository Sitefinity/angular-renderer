import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector, RendererFactory2, ViewContainerRef } from "@angular/core";
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
    constructor(
        private appRef: ApplicationRef,
        private resolver: ComponentFactoryResolver,
        private renderContext: RenderContext,
        private renderer: RendererFactory2,
        private injector: Injector) {

    }

    public createAndInjectComponent(widgetModel: WidgetModel, viewContainer: ViewContainerRef) {
        const type: any = TYPES_MAP[widgetModel.Name];
        if (!type) {
            return;
        }

        const factory = this.resolver.resolveComponentFactory(type);
        const componentRef = viewContainer.createComponent(factory, undefined, viewContainer.injector);
        this.setAttributes(componentRef.location.nativeElement, widgetModel);

        const componentInstance = componentRef.instance as BaseComponent<ModelBase<any>>;
        this.setProperties(widgetModel, componentInstance);

        return componentInstance;
    }

    public createComponent(widgetModel: WidgetModel) {
        const type: any = TYPES_MAP[widgetModel.Name];
        if (!type) {
            return;
        }

        const factory = this.resolver.resolveComponentFactory(type);
        const componentRef = factory.create(this.injector);
        this.setAttributes(componentRef.location.nativeElement, widgetModel);

        const componentInstance = componentRef.instance as BaseComponent<ModelBase<any>>;
        this.setProperties(widgetModel, componentInstance);

        this.appRef.attachView(componentRef.hostView);
        this.appRef.tick();

        return componentRef;
    }

    private setAttributes(element: HTMLElement, widgetModel: WidgetModel) {
        if (this.renderContext.isEdit()) {
            this.renderer.createRenderer(null, null).setAttribute(element, "data-sfname", widgetModel.Name);
            this.renderer.createRenderer(null, null).setAttribute(element, "data-sftitle", widgetModel.Name);
            this.renderer.createRenderer(null, null).setAttribute(element, "data-sfemptyiconaction", "Edit");
            this.renderer.createRenderer(null, null).setAttribute(element, "data-sfid", widgetModel.Id);
            this.renderer.createRenderer(null, null).setAttribute(element, "data-sfisorphaned", "false");
            this.renderer.createRenderer(null, null).setAttribute(element, "data-sfiscontentwidget", "true");
            this.renderer.createRenderer(null, null).setAttribute(element, "data-sfisemptyvisualhidden", "false");
        }
    }

    private setProperties(componentData: WidgetModel, componentInstance: BaseComponent<ModelBase<any>>) {
        if (componentData && componentInstance) {
            Object.keys(componentData).forEach((propName) => {
                (componentInstance.Model as any)[propName] = (componentData as any)[propName];
            });
        }
    }
}
