import { Component, EventEmitter, Input, Output } from "@angular/core";
import { SdkItem } from "src/app/sdk/sdk-item";
import { ListWithSummaryModel } from "./list-with-summary-model";

@Component({
    templateUrl: "list-with-summary.component.html",
    selector: "app-content-list-list-with-summary"
})
export class ListWithSummaryComponent {
    @Input() model!: ListWithSummaryModel;
    @Output() onDetailItemOpen: EventEmitter<SdkItem> = new EventEmitter();

    onDetailItemOpenHandler(item: SdkItem, event: Event) {
        event.preventDefault();
        event.stopPropagation();

        this.onDetailItemOpen.emit(item);
    }
}
