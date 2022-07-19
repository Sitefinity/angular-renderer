import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../base.component";
import { RenderContext } from "src/app/services/render-context";
import { SectionEntity } from "./section.entity";
import { ColumnModel } from "./column-model";
const ColumnNamePrefix = "Column";

@Component({
    templateUrl: "section.component.html",
    selector: "app-section"
})
export class SectionComponent extends BaseComponent<SectionEntity> implements OnInit {
    constructor(public renderContext: RenderContext) {
        super();
    }

    ngOnInit() {
        this.Properties.ColumnsCount = this.Properties.ColumnsCount || 1;
        this.Properties.Columns = this.generateColumns();
    }

    private generateColumns(): ColumnModel[] {
        let columns: ColumnModel[] = [];
        for (let i = 0; i < this.Properties.ColumnsCount; i++) {
            let currentName = `${ColumnNamePrefix}${i + 1}`;
            let currentTitle = null;
            if (this.Properties.Labels && this.Properties.Labels.hasOwnProperty(currentName)) {
                currentTitle = this.Properties.Labels[currentName].Label;
            } else {
                currentTitle = currentName
            }

            columns.push({
                Name: currentName,
                Title: currentTitle
            });
        }

        return columns;
    }
}
