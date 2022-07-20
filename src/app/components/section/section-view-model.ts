import { AttributeHolder } from "./attribute-holder";
import { SectionHolder } from "./section-holder";

export interface SectionViewModel {
    Columns: AttributeHolder[],
    Section: SectionHolder
}
