import { Observable } from "rxjs";
import { BackgroundStyle } from "src/app/styling/background-style";
import { CustomCssModel } from "src/app/styling/custom-css-model";
import { OffsetStyle } from "src/app/styling/offset-style";
import { SimpleBackgroundStyle } from "src/app/styling/simple-background-style";
import { AttributeModel } from "../attribute-model";
import { AttributeHolder } from "./attribute-holder";
import { LabelModel } from "./label-model";
import { SectionHolder } from "./section-holder";

export interface SectionEntity {
    // for designer
    ColumnsCount: number,
    CssSystemGridSize: number,
    ColumnProportionsInfo: string,
    SectionPadding: string,
    SectionMargin: string,
    SectionBackground: string,
    ColumnsPadding: string,
    ColumnsBackground: string,
    CustomCssClass: string,
    Labels: string;
    Attributes: string;

    // for logic
    Columns: AttributeHolder[];
    Section: Observable<SectionHolder>;
}
