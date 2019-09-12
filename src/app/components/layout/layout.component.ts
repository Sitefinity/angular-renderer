import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { LayoutColumns, ColumnModel } from "../../models/container-model";
import { BaseComponent } from "../base.component";
import { PageContentService } from "../../services/page-content.service";

@Component({
    selector: "app-layout",
    templateUrl: "./layout.component.html"
})
export class LayoutComponent extends BaseComponent<{ [key: string]: string }> implements OnInit {
    public columns: ColumnModel[] = [];
    public container: ColumnModel = {} as any;
    public itemTemplateName: TemplateRef<any>;

    @ViewChild("oneColumn", { static: true }) private oneColumnTemplate: TemplateRef<any>;
    @ViewChild("twoColumns", { static: true }) private twoColumnsTemplate: TemplateRef<any>;
    @ViewChild("threeColumns", { static: true }) private threeColumnsTemplate: TemplateRef<any>;
    @ViewChild("fourColumns", { static: true }) private fourColumnsTemplate: TemplateRef<any>;
    @ViewChild("fiveColumns", { static: true }) private fiveColumnsTemplate: TemplateRef<any>;

    constructor(protected pageContentService: PageContentService) {
        super(pageContentService);
    }

    public ngOnInit() {
        this.setTemplate();
        this.generateColumns();
    }

    private generateColumns() {
        const columns = LayoutColumns[this.Model.ViewName];
        if (columns === 1) {
            const props = this.Model.Properties;
            const key = Object.keys(props)[0];
            const placeholder = this.getPlaceholder(key);
            this.container = {
                css: this.Model.Properties[`${placeholder}_Css`],
                label: this.Model.Properties[`${placeholder}_Label`],
                children: this.Model.Children,
                placeholder
            };
        } else if (columns > 1) {
            this.generateColumnsModels();
        }
    }

    private generateColumnsModels() {
        const props = this.Model.Properties;

        const columns: ColumnModel[] = [];

        for (const key in props) {
            if (!Object.hasOwnProperty(key)) {
                const placeholder = this.getPlaceholder(key);
                if (!columns.some(c => c.placeholder === placeholder)) {
                    const children = this.Model.Children.filter(c => c.PlaceHolder === placeholder);
                    columns.push({ children, placeholder, css: null, label: null });
                }

                const column = columns.find(c => c.placeholder === placeholder);

                if (key.includes("Css")) {
                    column.css = props[key];
                } else if (key.includes("Label")) {
                    column.label = props[key];
                }
            }
        }

        const rowIndex = columns.findIndex(c => c.label == null);

        this.container = rowIndex !== -1 ? columns.splice(rowIndex, 1)[0] : { css: "row", label: null, children: [], placeholder: null };
        this.columns = columns;
        console.log(columns);
    }

    private getPlaceholder(key: string) {
        let ret;
        ["_Css", "_Label"].forEach(v => {
            if (key.includes(v)) {
                ret = key.replace(v, "");
            }
        });

        return ret;
    }

    private setTemplate() {
        const columns = LayoutColumns[this.Model.ViewName];
        switch (columns) {
            case 1:
                this.itemTemplateName = this.oneColumnTemplate;
                break;
            case 2:
                this.itemTemplateName = this.twoColumnsTemplate;
                break;
            case 3:
                this.itemTemplateName = this.threeColumnsTemplate;
                break;
            case 4:
                this.itemTemplateName = this.fourColumnsTemplate;
                break;
            case 5:
                this.itemTemplateName = this.fiveColumnsTemplate;
                break;
            default:
                console.log("CUSTOM TEMPLATE IS NOT RESOLVED");
                break;
        }
    }
}
