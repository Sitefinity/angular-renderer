import { Component, EventEmitter, Input, Output } from "@angular/core";
import { SdkItem } from "src/app/sdk/sdk-item";
import { CardsListModel } from "./cards-list-model";

@Component({
    templateUrl: "cards-list.component.html",
    selector: "app-content-list-cards-list"
})
export class CardsListComponent {
    @Input() model!: CardsListModel;
    @Output() onDetailItemOpen: EventEmitter<SdkItem> = new EventEmitter();

    onDetailItemOpenHandler(item: SdkItem, event: Event) {
        event.preventDefault();
        event.stopPropagation();

        this.onDetailItemOpen.emit(item);
    }
}
