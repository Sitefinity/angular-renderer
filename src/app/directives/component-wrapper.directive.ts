import { ModelBase } from "../models/model-base";
import { ContentComponent } from "../components/content-block/content-block.component";
import { Directive, OnInit, ViewContainerRef, Input, ComponentFactoryResolver, Renderer2 } from "@angular/core";
import { PageContentService } from "../services/page-content.service";
import { BaseComponent } from '../components/base.component';
import { RenderContext } from '../services/render-context';
import { RenderWidgetService } from "../services/render-widget.service";

const TYPES_MAP: { [key: string]: Function } = {
    ContentBlock: ContentComponent
};

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: "[componentWrapper]"
})
export class WrapperComponentDirective implements OnInit {
    @Input("componentWrapper") componentData!: ModelBase<any>;

    constructor(
        private viewContainer: ViewContainerRef,
        private renderWidgetService: RenderWidgetService) { }

    public ngOnInit(): void {
        if (!this.componentData) {
            return;
        }

        const type: any = TYPES_MAP[this.componentData.Name];
        if (!type) {
            return;
        }

        this.renderWidgetService.createAndInjectComponent(this.componentData, this.viewContainer);
    }
}
