import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable()
export class RenderContext {

    isEdit(): boolean {
        return window.location.href.indexOf("sfaction=edit") !== -1;
    }
}
