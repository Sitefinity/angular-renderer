import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../base.component";
import { RenderContext } from "src/app/services/render-context";
import { SectionEntity } from "./section.entity";
import { RestSdkTypes, RestService } from "src/app/sdk/services/rest.service";
import { VideoItem } from "src/app/sdk/video-item";
import { StyleGenerator } from "src/app/styling/style-generator.service";
import { ImageItem } from "src/app/sdk/image-item";
import { Observable, ReplaySubject } from "rxjs";
import { SectionHolder } from "./section-holder";
import { SectionViewModel } from "./section-view-model";
import { StylingConfig } from "src/app/styling/styling-config";
import { ColumnHolder } from "./column-holder";
import { ComponentContainer } from "src/app/directives/component-wrapper.directive";
const ColumnNamePrefix = "Column";
const sectionKey = "Section";

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
        const sectionObject: SectionHolder = {
            Attributes: {}
        }

        let attributes = this.Properties.Attributes;
        if (attributes && attributes.hasOwnProperty(sectionKey)) {
            attributes[sectionKey].forEach((attribute) => {
                sectionObject.Attributes[attribute.Key] = attribute.Value;
            });
        }

        const sectionClasses: string[] = ["row"];
        if (this.Properties.SectionPadding) {
            const paddingClasses = this.styleGenerator.getPaddingClasses(this.Properties.SectionPadding);
            sectionClasses.push(paddingClasses);
        }

        if (this.Properties.SectionMargin) {
            const marginClasses = this.styleGenerator.getPaddingClasses(this.Properties.SectionMargin);
            sectionClasses.push(marginClasses);
        }

        if (this.Properties.CustomCssClass && this.Properties.CustomCssClass.hasOwnProperty(sectionKey)) {
            sectionClasses.push(this.Properties.CustomCssClass[sectionKey].Class);
        }

        if (!this.Properties.SectionBackground) {
            sectionObject.Attributes["class"] = sectionClasses.filter(x => x).join(" ");
            section$.next(sectionObject);
            return section$.asObservable();
        }

        if (!this.Properties.SectionBackground) {
            sectionObject.Attributes["class"] = sectionClasses.filter(x => x).join(" ");
            section$.next(sectionObject);
            return section$.asObservable();
        }

        if (this.Properties.SectionBackground.BackgroundType === "Video") {
            if (this.Properties.SectionBackground.VideoItem && this.Properties.SectionBackground.VideoItem.Id) {
                sectionClasses.push(StylingConfig.VideoBackgroundClass);
                this.restService.getItemWithFallback<VideoItem>(RestSdkTypes.Video, this.Properties.SectionBackground.VideoItem.Id, this.Properties.SectionBackground.VideoItem.Provider).subscribe((video) => {
                    sectionObject.ShowVideo = true;
                    sectionObject.VideoUrl = video.Url;
                    sectionObject.Attributes["class"] = sectionClasses.filter(x => x).join(" ");

                    section$.next(sectionObject);
                });

                return section$.asObservable();
            }
        } else if (this.Properties.SectionBackground.BackgroundType === "Image" && this.Properties.SectionBackground.ImageItem && this.Properties.SectionBackground.ImageItem.Id) {
            const imagePosition = this.Properties.SectionBackground.Position || "Fill";
            sectionClasses.push(StylingConfig.ImageBackgroundClass);
            this.restService.getItemWithFallback<ImageItem>(RestSdkTypes.Image, this.Properties.SectionBackground.ImageItem.Id, this.Properties.SectionBackground.ImageItem.Provider).subscribe((image) => {
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
            });
            return section$.asObservable();
        } else if (this.Properties.SectionBackground.BackgroundType === "Color" && this.Properties.SectionBackground.Color) {
            const style = `--sf-backgrоund-color: ${this.Properties.SectionBackground.Color}`;
            sectionObject.Attributes["style"] = style;
        }

        sectionObject.Attributes["class"] = sectionClasses.filter(x => x).join(" ");
        section$.next(sectionObject);
        return section$.asObservable();
    }

    private populateColumns(): ColumnHolder[] {
        let columns: ColumnHolder[] = [];

        for (let i = 0; i < this.Properties.ColumnsCount; i++) {
            let currentName = `${ColumnNamePrefix}${i + 1}`;

            const classAttribute = `col-md-${this.Properties.ColumnProportionsInfo[i]}`;
            const classAttributes = [classAttribute];
            let children: Array<ComponentContainer> = [];
            if (this.Model.Children) {
                children = this.Model.Children.filter(x => x.PlaceHolder === currentName).map((x => {
                    return <ComponentContainer>{
                        model: x,
                        context: this.RequestContext
                    }
                }));
            }

            const column: ColumnHolder = {
                Attributes: { },
                Children: children
            };

            if (this.renderContext.isEdit()) {
                column.Attributes["data-sfcontainer"] = currentName;

                let currentTitle = null;
                if (this.Properties.Labels && this.Properties.Labels.hasOwnProperty(currentName)) {
                    currentTitle = this.Properties.Labels[currentName].Label;
                } else {
                    currentTitle = currentName
                }

                column.Attributes["data-sfplaceholderlabel"] = currentTitle;
            }

            if (this.Properties.Attributes && this.Properties.Attributes.hasOwnProperty(currentName)) {
                this.Properties.Attributes[currentName].forEach((attribute) => {
                    column.Attributes[attribute.Key] = attribute.Value;
                });
            }

            if (this.Properties.ColumnsBackground && this.Properties.ColumnsBackground.hasOwnProperty(currentName)) {
                const backgroundStyle = this.Properties.ColumnsBackground[currentName];
                if (backgroundStyle.BackgroundType == "Color") {
                    column.Attributes["style"] = `--sf-backgrоund-color: ${backgroundStyle.Color}`;
                }
            }

            if (this.Properties.ColumnsPadding && this.Properties.ColumnsPadding.hasOwnProperty(currentName)) {
                const columnPadding = this.Properties.ColumnsPadding[currentName];
                const paddings = this.styleGenerator.getPaddingClasses(columnPadding);
                if (paddings) {
                    column.Attributes["class"] = paddings;
                    classAttributes.push(paddings);
                }
            }

            if (this.Properties.CustomCssClass && this.Properties.CustomCssClass.hasOwnProperty(currentName)) {
                const columnCssClass = this.Properties.CustomCssClass[currentName];
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
