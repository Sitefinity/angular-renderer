import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { RootComponent } from "./components/root.component";
import { PageContentService } from "./services/page-content.service";
import { HttpClientModule } from "@angular/common/http";
import { LayoutComponent } from "./components/layout/layout.component";
import { ContentComponent } from "./components/content-block/content-block.component";
import { WrapperComponentDirective } from "./directives/component-wrapper.directive";
import { RootUrlService } from "./services/root-url.service";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    RootComponent,
    LayoutComponent,
    ContentComponent,
    WrapperComponentDirective
  ],
  entryComponents: [
    LayoutComponent,
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
    WrapperComponentDirective
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
