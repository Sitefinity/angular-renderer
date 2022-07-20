import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../base.component";
import { RenderContext } from "src/app/services/render-context";
import { SectionEntity } from "./section.entity";
import { ColumnModel } from "./column-model";
import { LabelModel } from "./label-model";
import { AttributeModel } from "../attribute-model";
import { SimpleBackgroundStyle } from "src/app/styling/simple-background-style";
import { BackgroundStyle } from "src/app/styling/background-style";
import { RestSdkTypes, RestService } from "src/app/sdk/rest-service";
import { VideoItem } from "src/app/sdk/video-item";
const ColumnNamePrefix = "Column";

@Component({
    templateUrl: "section.component.html",
    selector: "app-section"
})
export class SectionComponent extends BaseComponent<SectionEntity> implements OnInit {
    constructor(private renderContext: RenderContext, private restService: RestService) {
        super();
    }

    ngOnInit() {
        this.Properties.ColumnsCount = this.Properties.ColumnsCount || 1;
        this.Properties.ColumnProportionsInfo = this.Properties.ColumnProportionsInfo || "[12]";
        this.Properties.Columns = this.generateColumns();

        let sectionBackground: BackgroundStyle | null= null;
        if (this.Properties.SectionBackground) {
            sectionBackground = JSON.parse(this.Properties.SectionBackground);
            if (sectionBackground?.BackgroundType == "Video") {
                this.Properties.ShowVideo = true;
                if (sectionBackground.VideoItem) {
                    this.restService.getItemWithFallback<VideoItem>(RestSdkTypes.Video, sectionBackground.VideoItem.Id, sectionBackground.VideoItem.Provider).subscribe((video) => {
                        this.Properties.VideoUrl = video.Url;
                    });
                }
            }
        }
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

        let columnsBackground: { [key: string]: SimpleBackgroundStyle } | null = null;
        if (this.Properties.ColumnsBackground)
            columnsBackground = JSON.parse(this.Properties.ColumnsBackground);

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

            if (columnsBackground && columnsBackground.hasOwnProperty(currentName)) {
                const backgroundStyle = columnsBackground[currentName];
                if (backgroundStyle.BackgroundType == "Color") {
                    column.Attributes["style"] = `--sf-backgrоund-color: ${backgroundStyle.Color}`;
                }
            }

            columns.push(column);
        }

        return columns;
    }
}
