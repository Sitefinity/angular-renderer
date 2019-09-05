import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable, ReplaySubject } from "rxjs";
import { ComponentContext, ModelBase } from "../common";

@Injectable()
export class LazyContentService {
    public requestedIds$ = new ReplaySubject<string>();
    public receivedContent$ = new ReplaySubject<ModelBase>();

    constructor(private http: HttpClient) {

    }

    public get(url: string): Observable<ComponentContext> {
        const return$ = new Subject<ComponentContext>();

        this.http.get(`http://localhost:8000/api/default/pages/Default.LazyComponents(url=@param)?@param='${url}'`)
                .subscribe((s: ComponentContext) => {
            return$.next(s);
        }, error => {
            return$.error(error);
        });

        return return$;
    }

    public requestContent(id: string) {
        this.requestedIds$.next(id);
    }

    public sendContent(model: ModelBase) {
        this.receivedContent$.next(model);
    }
}
