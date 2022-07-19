import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../base.component";
import { RenderContext } from "src/app/services/render-context";
import { SectionEntity } from "./section.entity";
import { ColumnModel } from "./column-model";
import { BackgroundBase } from "src/app/styling/background-base";
import { LabelModel } from "./label-model";
import { AttributeModel } from "../attribute-model";
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
        this.Properties.ColumnProportionsInfo = this.Properties.ColumnProportionsInfo || "[12]";
        this.Properties.Columns = this.generateColumns();
    }

    private generateColumns(): ColumnModel[] {
        let columns: ColumnModel[] = [];

        const proportions = JSON.parse(this.Properties.ColumnProportionsInfo);
        let labels: { [key: string]: LabelModel } | null = null;
        if (this.Properties.Labels)
            labels = JSON.parse(this.Properties.Labels);

        let attributes: { [key: string]: Array<AttributeModel> } | null = null;
        if (this.Properties.Attributes)
            attributes = JSON.parse(this.Properties.Attributes);

        for (let i = 0; i < this.Properties.ColumnsCount; i++) {
            let currentName = `${ColumnNamePrefix}${i + 1}`;

            const classAttribute = `col-md-${proportions[i]}`;
            const column: ColumnModel = {
                Attributes: {
                    "class": classAttribute,
                }
            };

            if (this.renderContext.isEdit()) {
                column.Attributes["data-sfcontainer"] = currentName;

                let currentTitle = null;
                if (labels && labels.hasOwnProperty(currentName)) {
                    currentTitle = labels[currentName].Label;
                } else {
                    currentTitle = currentName
                }

                column.Attributes["data-sfplaceholderlabel"] = currentTitle;
            }

            if (attributes && attributes.hasOwnProperty(currentName)) {
                attributes[currentName].forEach((attribute) => {
                    column.Attributes[attribute.Key] = attribute.Value;
                });
            }

            if (this.Properties.ColumnsBackground && this.Properties.ColumnsBackground.hasOwnProperty(currentName)) {
                const backgroundStyle = this.Properties.ColumnsBackground[currentName];
                if (backgroundStyle.BackgroundType == BackgroundBase.Color) {
                    column.Attributes["style"] = `--sf-background-color: ${backgroundStyle.Color}`;
                }
            }

            columns.push(column);
        }

        return columns;
    }
}
