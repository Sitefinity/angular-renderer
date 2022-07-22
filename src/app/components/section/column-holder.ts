import { ComponentContainer } from "src/app/directives/component-wrapper.directive";

export interface ColumnHolder {
    Children: Array<ComponentContainer>
    Attributes: { [key: string]: string },
}
