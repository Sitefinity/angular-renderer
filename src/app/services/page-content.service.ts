import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { PageContentServiceResponse } from "../common";

@Injectable()
export class PageContentService {
    constructor(private http: HttpClient) { }

    public get(pageName: string) {
        const return$ = new Subject<PageContentServiceResponse>();
        this.http.get(`http://localhost:8000/api/default/pages/Default.Model(url=@param)?@param='${pageName}'`)
                .subscribe((s: PageContentServiceResponse) => {
            return$.next(s);
        }, error => {
            return$.error( error );
        });

        return return$;
    }
}
