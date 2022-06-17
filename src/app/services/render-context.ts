import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable()
export class RenderContext {
    cultureName!: string;

    isEdit(): boolean {
        return window.location.href.indexOf("sfaction=edit") !== -1;
    }
}
