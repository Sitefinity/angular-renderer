import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { RootComponent } from "./components/root.component";
import { PageContentService } from "./services/page-content.service";
import { HttpClientModule } from "@angular/common/http";
import { ContentComponent } from "./components/content-block/content-block.component";
import { WrapperComponentDirective } from "./directives/component-wrapper.directive";
import { RootUrlService } from "./services/root-url.service";
import { CommonModule } from "@angular/common";
import { RendererContractImpl } from "./services/renderer-contract";
import { RenderContext } from "./services/render-context";
import { RenderWidgetService } from "./services/render-widget.service";

@NgModule({
    declarations: [
        AppComponent,
        RootComponent,
        ContentComponent,
        WrapperComponentDirective
    ],
    entryComponents: [
        ContentComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        HttpClientModule,
        AppRoutingModule
    ],
    providers: [
        RootUrlService,
        PageContentService,
        RenderContext,
        RenderWidgetService,
        RendererContractImpl,
        WrapperComponentDirective
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
