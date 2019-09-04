import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

@Injectable()
export class LazyContentService {
    constructor(private http: HttpClient) {

    }

    public requestContent(id: string) {
        const return$ = new Subject();

        this.http.get("asdf").subscribe(s => {
            return$.next(s);
        });

        return return$;
    }
}
