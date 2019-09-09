import { Injectable } from "@angular/core";

@Injectable()
export class RootUrlService {
    public getUrl() {
        return "http://localhost:8000";
    }
}
