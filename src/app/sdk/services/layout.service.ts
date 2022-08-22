import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, ReplaySubject } from "rxjs";
import { LazyComponentsResponse } from "src/app/models/lazy-components.response";
import { PageLayoutServiceResponse } from "src/app/models/service-response";
import { RenderContext } from "src/app/services/render-context";
import { RootUrlService } from "src/app/services/root-url.service";
import { RestSdkTypes, RestService } from "./rest.service";

@Injectable()
export class LayoutService {
    constructor(private http: HttpClient, private restService: RestService, private renderContext: RenderContext, private rootUrlService: RootUrlService) {

    }

    public get(pagePathAndQuery: string): Observable<PageLayoutServiceResponse> {
        const rootUrl = this.restService.buildItemBaseUrl(RestSdkTypes.Pages);

        let serviceUrl = `${rootUrl}/Default.Model(url=@param)?@param='${encodeURIComponent(pagePathAndQuery)}'`;
        if (this.renderContext.isEdit()) {
            serviceUrl += "&sfaction=edit";
        } else if (this.renderContext.isPreview()) {
            serviceUrl += "&sfaction=preview";
        }

        return this.http.get<PageLayoutServiceResponse>(serviceUrl);
    }

    public getLazyComponents(pagePathAndQuery: string): Observable<LazyComponentsResponse> {
        var headers: {[key: string]: string} = {};
        var referrer = document.referrer;
        if (referrer && referrer.length > 0) {
            headers["SF_URL_REFERER"] = referrer;
        }
        else {
            headers["SF_NO_URL_REFERER"] = 'true';
        }

        let serviceUrl = `${this.rootUrlService.getServiceUrl()}Default.LazyComponents(url=@param)?@param='${encodeURIComponent(pagePathAndQuery)}'`;
        serviceUrl += "&correlationId=" + (window as any)["sfCorrelationId"];

        return this.http.get<LazyComponentsResponse>(serviceUrl, { headers });
    }
}
