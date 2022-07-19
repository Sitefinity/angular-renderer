import { BackgroundStyle } from "src/app/styling/background-style";
import { CustomCssModel } from "src/app/styling/custom-css-model";
import { OffsetStyle } from "src/app/styling/offset-style";
import { SimpleBackgroundStyle } from "src/app/styling/simple-background-style";
import { AttributeModel } from "../attribute-model";
import { ColumnModel } from "./column-model";
import { LabelModel } from "./label-model";

export interface SectionEntity {
    // for designer
    ColumnsCount: number,
    CssSystemGridSize: number,
    ColumnProportionsInfo: string[],
    SectionPadding: OffsetStyle,
    SectionMargin: OffsetStyle,
    SectionBackground: BackgroundStyle,
    ColumnsPadding: { [key: string]: OffsetStyle },
    ColumnsBackground: { [key: string]: SimpleBackgroundStyle },
    CustomCssClass: { [key: string]: CustomCssModel },
    Labels: { [key: string]: LabelModel },
    Attributes: { [key: string]: Array<AttributeModel> }

    // for logic
    Columns: ColumnModel[];
    WrapperCssClass: string;
    SectionClasses: string;
}
