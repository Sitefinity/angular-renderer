import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable()
export class RenderContext {
    constructor(private router: Router) {

    }

    isEdit(): boolean {
        var params = this.router.parseUrl(this.router.url).queryParams;
        return params["sfaction"] === "edit";
    }
}
