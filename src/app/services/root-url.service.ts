import { Injectable } from "@angular/core";

@Injectable()
export class RootUrlService {
    public getUrl() {
        return `${window.location.origin}/`;
    }

    public getServiceUrl() {
        return `${this.getUrl()}api/default/`
    }
}
