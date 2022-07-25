import { Component, Input } from "@angular/core";
import { CardsListModel } from "./cards-list-model";

@Component({
    templateUrl: "cards-list.component.html",
    selector: "app-content-list-cards-list"
})
export class CardsListComponent {
    @Input() model!: CardsListModel;
}
