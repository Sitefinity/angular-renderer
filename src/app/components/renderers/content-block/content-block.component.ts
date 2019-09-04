import { Component, OnInit } from "@angular/core";
import { LazyContentService } from "../../../services/lazy-content.service";
import { ContentBlockProperties, ContentBlockModel } from "../../../common";

@Component({
    templateUrl: "content-block.component.html",
    selector: "app-content"
})
export class ContentComponent extends ContentBlockModel implements OnInit {
    public Properties: ContentBlockProperties;

    constructor(private lazyService: LazyContentService) {
        super();
    }

    ngOnInit(): void {
        if (this.Lazy) {
            this.lazyService.requestContent(this.Id).subscribe((content: any) => {
                this.Properties.Content = content;
            });
        }
    }
}
