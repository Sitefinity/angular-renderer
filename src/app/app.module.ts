import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { ContentComponent } from "./components/content-block/content-block.component";
import { WrapperComponentDirective } from "./directives/component-wrapper.directive";
import { RootUrlService } from "./services/root-url.service";
import { CommonModule } from "@angular/common";
import { RendererContractImpl } from "./services/renderer-contract";
import { RenderContext } from "./services/render-context";
import { RenderWidgetService } from "./services/render-widget.service";
import { ErrorComponent } from "./components/error/error.component";
import { SectionComponent } from "./components/section/section.component";
import { DynamicAttributesDirective } from "./directives/dynamic-attributes.directive";
import { RestService } from "./sdk/services/rest.service";
import { StyleGenerator } from "./styling/style-generator.service";
import { ContentListComponent } from "./components/content-list/content-list.component";
import { ContentListDetailComponent } from "./components/content-list/detail/content-list-detail.component";
import { LayoutService } from "./sdk/services/layout.service";
import { ServiceMetadata } from "./sdk/service-metadata";

@NgModule({
    declarations: [
        AppComponent,
        ContentComponent,
        SectionComponent,
        ContentListComponent,
        ContentListDetailComponent,
        ErrorComponent,
        WrapperComponentDirective,
        DynamicAttributesDirective,
    ],
    entryComponents: [
        ContentComponent,
        ErrorComponent,
        SectionComponent,
        ContentListComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        HttpClientModule,
    ],
    providers: [
        RootUrlService,
        LayoutService,
        ServiceMetadata,
        RestService,
        StyleGenerator,
        RenderContext,
        RenderWidgetService,
        RendererContractImpl,
        WrapperComponentDirective,
        DynamicAttributesDirective,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
