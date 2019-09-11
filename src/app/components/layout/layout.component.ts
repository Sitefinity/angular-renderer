import { Component, OnInit } from "@angular/core";
import { ContainerModel, LayoutColumns, ColumnModel } from "../../models/container-model";
import { BaseComponent } from "../base.component";
import { PageContentService } from "../../services/page-content.service";

@Component({
    selector: "app-layout",
    templateUrl: "./layout.component.html"
})
export class LayoutComponent extends BaseComponent<ContainerModel> implements OnInit {
    public columns: ColumnModel[] = [];

    constructor(protected pageContentService: PageContentService) {
        super(pageContentService);
    }

    public ngOnInit() {
        this.generateColumns();
    }

    private generateColumns() {
        const columns = LayoutColumns[this.Model.ViewName];
        if (columns === 1) {
            this.columns.push({
                css: this.Model.Properties[`Container_Css`],
                label: this.Model.Properties[`Container_Label`],
                children: this.Model.Children
            });
        } else {
            let temp: any = {};
            const props = this.Model.Properties;
            for (const key in props) {
                if (!Object.hasOwnProperty(key)) {
                    if (key.includes("Css")) {
                        temp.css = props[key];
                    } else if (key.includes("Label")) {
                        temp.label = props[key];
                    }

                    if (temp.css !== undefined && temp.label !== undefined) {
                        const placeholder = this.getPlaceholder(key);
                        temp.children = this.Model.Children.filter(c => c.PlaceHolder === placeholder);
                        this.columns.push(temp);
                        temp = {};
                    }
                }
            }
        }
    }

    private getPlaceholder(key: string) {
        let ret;
        ["Css", "Label"].forEach(v => {
            if (key.includes(v)) {
                ret = key.replace(v, "");
            }
        });

        return ret;
    }
}
