import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../base.component";
import { RenderContext } from "src/app/services/render-context";
import { SectionEntity } from "./section.entity";
import { AttributeHolder } from "./attribute-holder";
import { LabelModel } from "./label-model";
import { AttributeModel } from "../attribute-model";
import { SimpleBackgroundStyle } from "src/app/styling/simple-background-style";
import { BackgroundStyle } from "src/app/styling/background-style";
import { RestSdkTypes, RestService } from "src/app/sdk/rest-service";
import { VideoItem } from "src/app/sdk/video-item";
import { OffsetStyle } from "src/app/styling/offset-style";
import { CustomCssModel } from "src/app/styling/custom-css-model";
import { StyleGenerator } from "src/app/styling/style-generator.service";
import { ImageItem } from "src/app/sdk/image-item";
import { BehaviorSubject, Observable, ReplaySubject } from "rxjs";
import { SectionHolder } from "./section-holder";
import { SectionViewModel } from "./section-view-model";
import { StylingConfig } from "src/app/styling/styling-config";
import { ColumnHolder } from "./column-holder";
const ColumnNamePrefix = "Column";

@Component({
    templateUrl: "section.component.html",
    selector: "app-section"
})
export class SectionComponent extends BaseComponent<SectionEntity> implements OnInit {
    viewModel$: ReplaySubject<SectionViewModel> = new ReplaySubject<SectionViewModel>();

    constructor(
        private renderContext: RenderContext,
        private restService: RestService,
        private styleGenerator: StyleGenerator) {
        super();
    }

    ngOnInit() {
        this.Properties.ColumnsCount = this.Properties.ColumnsCount || 1;
        this.Properties.ColumnProportionsInfo = this.Properties.ColumnProportionsInfo || "[12]";

        this.populateSection().subscribe((section) => {
            this.viewModel$.next({
                Section: section,
                Columns: this.populateColumns()
            });
        });
    }

    private populateSection(): Observable<SectionHolder> {
        const section$ = new ReplaySubject<SectionHolder>();
        this.Properties.Section = section$.asObservable();
        const sectionObject: SectionHolder = {
            Attributes: {}
        }

        let attributes: { [key: string]: Array<AttributeModel> } | null = null;
        if (this.Properties.Attributes) {
            attributes = JSON.parse(this.Properties.Attributes);
            if (attributes && attributes.hasOwnProperty("Section")) {
                attributes["Section"].forEach((attribute) => {
                    sectionObject.Attributes[attribute.Key] = attribute.Value;
                });
            }
        }

        const sectionClasses: string[] = ["row"];
        let sectionPadding: OffsetStyle | null = null;
        if (this.Properties.SectionPadding) {
            sectionPadding = JSON.parse(this.Properties.SectionPadding);
            if (sectionPadding) {
                const paddingClasses = this.styleGenerator.getPaddingClasses(sectionPadding);
                sectionClasses.push(paddingClasses);
            }
        }

        let sectionMargin: OffsetStyle | null = null;
        if (this.Properties.SectionMargin) {
            sectionMargin = JSON.parse(this.Properties.SectionMargin);
            if (sectionMargin) {
                const marginClasses = this.styleGenerator.getPaddingClasses(sectionMargin);
                sectionClasses.push(marginClasses);
            }
        }

        let customCssClass: { [key: string]: CustomCssModel } | null = null;
        if (this.Properties.CustomCssClass) {
            customCssClass = JSON.parse(this.Properties.CustomCssClass);
            if (customCssClass && customCssClass.hasOwnProperty("Section")) {
                sectionClasses.push(customCssClass["Section"].Class);
            }
        }

        if (!this.Properties.SectionBackground) {
            sectionObject.Attributes["class"] = sectionClasses.filter(x => x).join(" ");
            section$.next(sectionObject);
            return section$.asObservable();
        }

        let sectionBackground: BackgroundStyle | null = null;
        sectionBackground = JSON.parse(this.Properties.SectionBackground);
        if (!sectionBackground) {
            sectionObject.Attributes["class"] = sectionClasses.filter(x => x).join(" ");
            section$.next(sectionObject);
            return section$.asObservable();
        }

        if (sectionBackground.BackgroundType === "Video") {
            if (sectionBackground.VideoItem && sectionBackground.VideoItem.Id) {
                sectionClasses.push(StylingConfig.VideoBackgroundClass);
                this.restService.getItemWithFallback<VideoItem>(RestSdkTypes.Video, sectionBackground.VideoItem.Id, sectionBackground.VideoItem.Provider).subscribe((video) => {
                    sectionObject.ShowVideo = true;
                    sectionObject.VideoUrl = video.Url;
                    sectionObject.Attributes["class"] = sectionClasses.filter(x => x).join(" ");

                    section$.next(sectionObject);
                });

                return section$.asObservable();
            }
        } else if (sectionBackground.BackgroundType === "Image" && sectionBackground.ImageItem && sectionBackground.ImageItem.Id) {
            const imagePosition = sectionBackground.Position || "Fill";
            sectionClasses.push(StylingConfig.ImageBackgroundClass);
            this.restService.getItemWithFallback<ImageItem>(RestSdkTypes.Image, sectionBackground.ImageItem.Id, sectionBackground.ImageItem.Provider).subscribe((image) => {
                let style = "";
                switch (imagePosition) {
                    case "Fill":
                        style = "--sf-background-size: 100% auto;";
                        break;
                    case "Center":
                        style = "--sf-background-position: center";
                        break;
                    default:
                        style = "--sf-background-size: cover;";
                        break;
                }

                style = `--sf-backgrоund-image: url(${image.Url});${style}`;
                sectionObject.Attributes["style"] = style;
                sectionObject.Attributes["class"] = sectionClasses.filter(x => x).join(" ");
                section$.next(sectionObject);
                return section$.asObservable();
            });
        } else if (sectionBackground.BackgroundType === "Color" && sectionBackground.Color) {
            const style = `--sf-backgrоund-color: ${sectionBackground.Color}`;
            sectionObject.Attributes["style"] = style;
        }

        sectionObject.Attributes["class"] = sectionClasses.filter(x => x).join(" ");
        section$.next(sectionObject);
        return section$.asObservable();
    }

    private populateColumns(): ColumnHolder[] {
        let columns: ColumnHolder[] = [];

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

        let columnsPadding: { [key: string]: OffsetStyle } | null = null;
        if (this.Properties.ColumnsPadding)
            columnsPadding = JSON.parse(this.Properties.ColumnsPadding);

        let customCssClass: { [key: string]: CustomCssModel } | null = null;
        if (this.Properties.CustomCssClass)
            customCssClass = JSON.parse(this.Properties.CustomCssClass);

        for (let i = 0; i < this.Properties.ColumnsCount; i++) {
            let currentName = `${ColumnNamePrefix}${i + 1}`;

            const classAttribute = `col-md-${proportions[i]}`;
            const classAttributes = [classAttribute];
            const children = this.Model.Children.filter(x => x.PlaceHolder === currentName);
            const column: ColumnHolder = {
                Attributes: {
                },
                Children: children
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

            if (columnsPadding && columnsPadding.hasOwnProperty(currentName)) {
                const columnPadding = columnsPadding[currentName];
                const paddings = this.styleGenerator.getPaddingClasses(columnPadding);
                if (paddings) {
                    column.Attributes["class"] = paddings;
                    classAttributes.push(paddings);
                }
            }

            if (customCssClass && customCssClass.hasOwnProperty(currentName)) {
                const columnCssClass = customCssClass[currentName];
                if (columnCssClass && columnCssClass.Class) {
                    classAttributes.push(columnCssClass.Class);
                }
            }

            if (column.Attributes["class"])
                classAttributes.push(column.Attributes["class"]);

            column.Attributes["class"] = classAttributes.filter(x => x).join(" ");

            columns.push(column);
        }

        return columns;
    }
}
