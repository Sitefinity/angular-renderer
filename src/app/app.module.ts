import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { RootComponent } from "./components/root.component";
import { PageContentService } from "./services/page-content.service";
import { HttpClientModule } from "@angular/common/http";
import { LayoutComponent } from "./components/layout/layout.component";
import { ContentComponent } from "./components/content-block/content-block.component";
import { RemoveWrapperDirective } from "./directives/remove-wrapper.directive";
import { WrapperComponentDirective } from "./components/component-wrapper.directive";
import { RootUrlService } from "./services/root-url.service";

@NgModule({
  declarations: [
    AppComponent,
    RootComponent,
    LayoutComponent,
    ContentComponent,
    WrapperComponentDirective,
    RemoveWrapperDirective,
  ],
  entryComponents: [
    LayoutComponent,
    ContentComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    RootUrlService,
    PageContentService,
    WrapperComponentDirective,
    RemoveWrapperDirective
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
