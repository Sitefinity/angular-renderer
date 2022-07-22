import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { RestService } from "./services/rest.service";

export class ServiceMetadata {
    constructor(private http: HttpClient) {
        this.http.get()
    }

    public init(): Observable<void> {

    }

    public getParentType() {

    }
}
