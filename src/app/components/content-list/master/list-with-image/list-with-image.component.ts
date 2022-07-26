import { Component, EventEmitter, Input, Output } from "@angular/core";
import { SdkItem } from "src/app/sdk/sdk-item";
import { ListWithImageModel } from "./list-with-image-model";

@Component({
    templateUrl: "list-with-image.component.html",
    selector: "app-content-list-list-with-image"
})
export class ListWithImageComponent {
    @Input() model!: ListWithImageModel;
    @Output() onDetailItemOpen: EventEmitter<SdkItem> = new EventEmitter();

    onDetailItemOpenHandler(item: SdkItem, event: Event) {
        event.preventDefault();
        event.stopPropagation();

        this.onDetailItemOpen.emit(item);
    }
}
