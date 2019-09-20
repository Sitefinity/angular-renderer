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
    public rowCss: string;

    public itemTemplateName: TemplateRef<any>;

    @ViewChild("container", { static: true }) private containerTemplate: TemplateRef<any>;
    @ViewChild("oneColumn", { static: true }) private oneColumnTemplate: TemplateRef<any>;
    @ViewChild("twoColumns", { static: true }) private twoColumnsTemplate: TemplateRef<any>;
    @ViewChild("threeColumns", { static: true }) private threeColumnsTemplate: TemplateRef<any>;
    @ViewChild("fourColumns", { static: true }) private fourColumnsTemplate: TemplateRef<any>;
    @ViewChild("fiveColumns", { static: true }) private fiveColumnsTemplate: TemplateRef<any>;

    constructor(protected pageContentService: PageContentService) {
        super(pageContentService);
    }

    public ngOnInit() {
        this.rowCss = this.Model.Properties[`Row_Css`];
        this.setTemplate(this.rowCss);
        this.generateColumns();
    }

    private generateColumns() {
        const columns = LayoutColumns[this.Model.ViewName];
        this.generateColumnsModels(columns);
    }

    private generateColumnsModels(colCount: number) {
        const columns: ColumnModel[] = [];
        if (!this.rowCss) {
          const placeholder = "Container";
          columns.push(this.getColumn(placeholder));
        } else {
          for (let i = 0; i < colCount; i++) {
            const placeholder = `Column${i + 1}`;
            columns.push(this.getColumn(placeholder));
          }
        }

        this.columns = columns;
    }

    private getColumn(placeholder: string) : ColumnModel {
      const children = this.Model.Children.filter(c => c.PlaceHolder === placeholder);
      return {
        children,
        placeholder,
        css: this.Model.Properties[`${placeholder}_Css`],
        label: this.Model.Properties[`${placeholder}_Label`],
      };
    }

    private setTemplate(rowCss: string) {
        if (!rowCss) {
          this.itemTemplateName = this.containerTemplate;
          return;
        }

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
