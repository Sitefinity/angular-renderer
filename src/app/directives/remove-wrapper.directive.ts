import { Directive, ElementRef, AfterViewInit } from "@angular/core";

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: "[remove-wrapper]"
 })
 export class RemoveWrapperDirective implements AfterViewInit {
     constructor(private el: ElementRef) {
    }

    ngAfterViewInit(): void {
        const parentElement = this.el.nativeElement.parentElement;
        const element = this.el.nativeElement;
        parentElement.removeChild(element);
        parentElement.parentNode.insertBefore(element.childNodes[0], parentElement.nextSibling);
        parentElement.parentNode.removeChild(parentElement);
    }
 }
