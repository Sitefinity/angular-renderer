import { Directive, Input, ElementRef, RendererFactory2, OnChanges, SimpleChanges } from "@angular/core";


@Directive({
    // tslint:disable-next-line:directive-selector
    selector: "[dynamicAttributes]"
})
export class DynamicAttributesDirective implements OnChanges {
    @Input("dynamicAttributes") attributes: { [key: string]: string } | undefined;

    constructor(
        private renderer: RendererFactory2,
        private elementRef: ElementRef) {

        }

    ngOnChanges(changes: SimpleChanges): void {
        const attributes = changes["attributes"];
        if (attributes.currentValue) {
            const renderer = this.renderer.createRenderer(null, null);
            Object.keys(attributes.currentValue).forEach((attribute) => {
                renderer.setAttribute(this.elementRef.nativeElement, attribute, attributes.currentValue[attribute]);
            });
        }
    }
}
