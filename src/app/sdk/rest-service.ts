import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RootUrlService } from "../services/root-url.service";
import { SdkItem } from "./sdk-item";

export class RestSdkTypes {
    public static readonly Video: string = "Telerik.Sitefinity.Libraries.Model.Video";
    public static readonly Image: string = "Telerik.Sitefinity.Libraries.Model.Image";
    public static readonly News: string = "Telerik.Sitefinity.News.Model.NewsItem";
}

@Injectable()
export class RestService {
    private readonly serviceApi = "api/default";
    constructor(private http: HttpClient, private rootUrlService: RootUrlService) {

    }

    getItemWithFallback<T extends SdkItem>(itemType: string, id: string, provider: string): Observable<T> {
        const rootUrl = this.rootUrlService.getUrl();
        const setName = this.getSetNameForType(itemType);
        const wholeUrl = `${rootUrl}/${this.serviceApi}/${setName}(${id})/Default.GetItemWithFallback()${this.buildQueryParams({
            sf_provider: provider,
            sf_fallback_prop_names: "*",
            $select: "*"
        })}`;

        return this.http.get<T>(wholeUrl);
    }

    getItemWithStatus<T extends SdkItem>(itemType: string, id: string, provider: string, queryParams: {[key: string]: string}): Observable<T> {
        const rootUrl = this.rootUrlService.getUrl();
        const setName = this.getSetNameForType(itemType);
        let queryParamsForMethod = {
            sf_provider: provider,
            $select: "*"
        };

        queryParamsForMethod = Object.assign(queryParamsForMethod, queryParams)
        const wholeUrl = `${rootUrl}/${this.serviceApi}/${setName}(${id})/Default.GetItemWithStatus()${this.buildQueryParams(queryParamsForMethod)}`

        return this.http.get<T>(wholeUrl);
    }

    getItem<T extends SdkItem>(itemType: string, id: string, provider: string): Observable<T> {
        const rootUrl = this.rootUrlService.getUrl();
        const setName = this.getSetNameForType(itemType);
        let queryParamsForMethod = {
            sf_provider: provider,
            $select: "*"
        };

        const wholeUrl = `${rootUrl}/${this.serviceApi}/${setName}(${id})${this.buildQueryParams(queryParamsForMethod)}`

        return this.http.get<T>(wholeUrl);
    }

    private buildQueryParams(queryParams: { [key: string]: string }) {
        let result = "";
        Object.keys(queryParams).forEach((key) => {
            result += `${key}=${queryParams[key]}&`;
        });

        if (result !== "") {
            result = "?" + result;
            result = result.substring(0, result.length - 2);
        }

        return result;
    }

    private getSetNameForType(itemType: string) {
        switch (itemType) {
            case RestSdkTypes.Image:
                return "images";
            case RestSdkTypes.Video:
                return "videos";
            case RestSdkTypes.News:
                return "newsitems";
            default:
                return null;
        }
    }
}
