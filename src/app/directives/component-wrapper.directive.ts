import { ModelBase } from "../models/model-base";
import { Directive, OnInit, ViewContainerRef, Input } from "@angular/core";
import { RenderWidgetService } from "../services/render-widget.service";


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
        this.renderWidgetService.createAndInjectComponent(this.componentData, this.viewContainer);
    }
}
