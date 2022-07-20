import { Directive, OnInit, Input, ElementRef, RendererFactory2 } from "@angular/core";


@Directive({
    // tslint:disable-next-line:directive-selector
    selector: "[dynamicAttributes]"
})
export class DynamicAttributesDirective implements OnInit {
    @Input("dynamicAttributes") attributes: { [key: string]: string } | undefined;

    constructor(
        private renderer: RendererFactory2,
        private elementRef: ElementRef) { }

    public ngOnInit(): void {
        if (!this.attributes)
            return;

        const renderer = this.renderer.createRenderer(null, null);
        Object.keys(this.attributes).forEach((attribute) => {
            if (!this.attributes)
                return;

            renderer.setAttribute(this.elementRef.nativeElement, attribute, this.attributes[attribute]);
        });
    }
}
