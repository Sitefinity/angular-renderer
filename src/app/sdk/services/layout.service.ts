import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, ReplaySubject } from "rxjs";
import { PageLayoutServiceResponse } from "src/app/models/service-response";
import { RenderContext } from "src/app/services/render-context";
import { RestSdkTypes, RestService } from "./rest.service";

@Injectable()
export class LayoutService {
    constructor(private http: HttpClient, private restService: RestService, private renderContext: RenderContext) {

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
}
