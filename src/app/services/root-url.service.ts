import { Injectable } from "@angular/core";

@Injectable()
export class RootUrlService {
    public getUrl() {
        return "https://localhost";
    }
}
