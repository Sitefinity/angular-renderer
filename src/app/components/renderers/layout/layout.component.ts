import { Component, Input, OnInit } from "@angular/core";
import { ContainerModel, LayoutColumns, ModelBase } from "../../../common";

@Component({
    selector: "app-layout",
    templateUrl: "./layout.component.html"
})
export class LayoutComponent extends ContainerModel implements OnInit {
    public columns: ColumnModel[] = [];

    constructor() {
        super();
    }

    public ngOnInit() {
        this.generateColumns();
    }

    private generateColumns() {
        const columns = LayoutColumns[this.ViewName];
        if (columns <= 1) {
            return;
        }
        for (let i = 1; i <= columns; i++) {
            this.columns.push({
                css: this.Properties[`Column${i}_Css`],
                label: this.Properties[`Column${i}_Label`],
                children: this.Children.filter(c => c.PlaceHolder === `Column${i}`)
            });
        }
    }
}

interface ColumnModel {
    css: string;
    label: string;
    children: ModelBase[];
}
