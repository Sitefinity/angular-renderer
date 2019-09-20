import { Injectable } from "@angular/core";

@Injectable()
export class RootUrlService {
    public getUrl() {
        return "http://10.211.55.3:3667";
    }
}
