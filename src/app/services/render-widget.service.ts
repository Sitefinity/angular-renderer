import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector, RendererFactory2, ViewContainerRef } from "@angular/core";
import { BaseComponent } from "../components/base.component";
import { ContentComponent } from "../components/content-block/content-block.component";
import { ErrorComponent } from "../components/error/error.component";
import { SectionComponent } from "../components/section/section.component";
import { ModelBase } from "../models/model-base";
import { RenderContext } from "./render-context";
import { WidgetModel } from "./renderer-contract";

export const TYPES_MAP: { [key: string]: Function } = {
    "SitefinityContentBlock": ContentComponent,
    "SitefinitySection": SectionComponent
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
        let type: any = TYPES_MAP[widgetModel.Name];
        let error: string | null = null;
        if (!type) {
            type = ErrorComponent;
            error = `No componenent with the name ${widgetModel.Name} found.`
        }

        const factory = this.resolver.resolveComponentFactory(type);
        const componentRef = viewContainer.createComponent(factory, undefined, viewContainer.injector);
        this.setAttributes(componentRef.location.nativeElement, widgetModel, error);

        const componentInstance = componentRef.instance as BaseComponent<ModelBase<any>>;
        this.setProperties(widgetModel, componentInstance);

        return componentInstance;
    }

    public createComponent(widgetModel: WidgetModel): Promise<ComponentRef<any>> {
        let type: any = TYPES_MAP[widgetModel.Name];
        let error: string | null = null;
        if (!type) {
            type = ErrorComponent;
            error = `No componenent with the name ${widgetModel.Name} found.`
        }

        const factory = this.resolver.resolveComponentFactory(type);
        const componentRef = factory.create(this.injector);
        this.setAttributes(componentRef.location.nativeElement, widgetModel, error);

        const componentInstance = componentRef.instance as BaseComponent<ModelBase<any>>;
        this.setProperties(widgetModel, componentInstance);

        this.appRef.attachView(componentRef.hostView);

        return new Promise((resolve) => {
            let counter = 0;
            let handle = setInterval(() => {
                this.appRef.tick();
                if (++counter === 5) {
                    clearInterval(handle);
                    resolve(componentRef);
                }
            }, 100);
        });
    }

    private setAttributes(element: HTMLElement, widgetModel: WidgetModel, error: string | null) {
        if (this.renderContext.isEdit()) {
            const renderer = this.renderer.createRenderer(null, null);
            renderer.setAttribute(element, "data-sfname", widgetModel.Name);
            renderer.setAttribute(element, "data-sftitle", widgetModel.Name);
            renderer.setAttribute(element, "data-sfemptyiconaction", "Edit");
            renderer.setAttribute(element, "data-sfid", widgetModel.Id);
            renderer.setAttribute(element, "data-sfisorphaned", "false");

            const isContentWidget = widgetModel.Name != "SitefinitySection";
            renderer.setAttribute(element, "data-sfiscontentwidget", isContentWidget.toString());
            renderer.setAttribute(element, "data-sfisemptyvisualhidden", "false");

            if (error) {
                renderer.setAttribute(element, "data-sferror", error);
            }
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
