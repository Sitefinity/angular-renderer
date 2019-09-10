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
        if (columns <= 1) {
            return;
        }
        for (let i = 1; i <= columns; i++) {
            this.columns.push({
                css: this.Model.Properties[`Column${i}_Css`],
                label: this.Model.Properties[`Column${i}_Label`],
                children: this.Model.Children.filter(c => c.PlaceHolder === `Column${i}`)
            });
        }
    }
}
