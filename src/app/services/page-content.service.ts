import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable, ReplaySubject } from "rxjs";
import { RootUrlService } from "./root-url.service";
import { ModelBase } from "../models/model-base";
import { PageContentServiceResponse, ComponentContext, ODataEntityResponse } from "../models/service-response";
import { RenderContext } from "./render-context";

@Injectable()
export class PageContentService {
    public receivedContent$ = new ReplaySubject<ModelBase<any>>();

    private readonly serviceApi = "api/default";

    constructor(private http: HttpClient, private rootUrlService: RootUrlService, private renderContext: RenderContext) { }

    public get(pageName: string): Observable<PageContentServiceResponse> {
        const return$ = new Subject<PageContentServiceResponse>();
        const rootUrl = this.rootUrlService.getUrl();
        let serviceUrl = `${rootUrl}/${this.serviceApi}/pages/Default.Model(url=@param)?@param='${pageName}'`;
        if (this.renderContext.isEdit()) {
            serviceUrl += "&sfaction=edit";
        }

        this.http.get<PageContentServiceResponse>(serviceUrl)
            .subscribe((s: PageContentServiceResponse) => {
                return$.next(s);

                if (s.ComponentContext.HasLazyComponents) {
                    this.getLazy(pageName).subscribe(r => {
                        r.Components.forEach(c => {
                            this.receivedContent$.next(c);
                        });
                    });
                }

            }, error => {
                return$.error(error);
            });

        return return$;
    }

    public getLazy(url: string): Observable<ComponentContext> {
        const return$ = new Subject<ComponentContext>();
        const rootUrl = this.rootUrlService.getUrl();

        this.http.get<ComponentContext>(`${rootUrl}/${this.serviceApi}/pages/Default.LazyComponents(url=@param)?@param='${url}'`)
            .subscribe((s: ComponentContext) => {
                return$.next(s);
            }, error => {
                return$.error(error);
            });

        return return$;
    }

    public getShared(id: string, providerName: string, cultureName: string, siteId: string): Observable<ODataEntityResponse> {
        const return$ = new Subject<ODataEntityResponse>();
        const rootUrl = this.rootUrlService.getUrl();

        this.http.get<ODataEntityResponse>(`${rootUrl}/${this.serviceApi}/contentitems(${id})?sf_provider=${providerName}&sf_culture=${cultureName}&sf_site=${siteId}`)
            .subscribe((s: ODataEntityResponse) => {
                return$.next(s);
            }, error => {
                return$.error(error);
            });

        return return$;
    }

    public sendContent(model: ModelBase<any>) {
        this.receivedContent$.next(model);
    }
}
