import { ModelBase } from "../models/model-base";
import { Directive, OnInit, ViewContainerRef, Input } from "@angular/core";
import { RenderWidgetService } from "../services/render-widget.service";
import { RequestContext } from "../services/request-context";


@Directive({
    // tslint:disable-next-line:directive-selector
    selector: "[componentWrapper]"
})
export class WrapperComponentDirective implements OnInit {
    @Input("componentWrapper") componentData!: ComponentContainer;

    constructor(
        private viewContainer: ViewContainerRef,
        private renderWidgetService: RenderWidgetService) { }

    public ngOnInit(): void {
        this.renderWidgetService.createAndInjectComponent(this.componentData, this.viewContainer);
    }
}

export interface ComponentContainer {
    model: ModelBase<any>;
    context: RequestContext
}
